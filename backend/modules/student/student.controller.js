const { Student } = require("./student.model");

const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { User } = require("../user/user.model");
const { group } = require("console");

const specialties = {
    EFFICOM: ["DW", "DA", "SR", "DATA", "CS"],
    ESGI: ["IW", "AL", "SRC", "SI"]
};


function randomPassword() {
    return crypto.randomBytes(6).toString("base64"); // 8–10 chars sûrs
}

function hashPassword(pwd) {
    return bcrypt.hash(pwd, 10);
}

const validateStudentInput = (body) => {
    const { school, specialty } = body;

    if (!specialties[school]) {
        throw new Error("École inconnue.");
    }

    if (!specialties[school].includes(specialty)) {
        throw new Error(`Spécialité '${specialty}' invalide pour l'école ${school}.`);
    }
}

exports.create = async (req, res) => {
    try {
        validateStudentInput(req.body);
        const student = await Student.create(req.body);
        res.json(student);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}

exports.generateAndSaveGroups = async (req, res) => {
    try {
        // 1. Récupérer tous les étudiants sans groupe
        const students = await Student.findAll({
            where: { groupId: null }
        });

        if (students.length === 0)
            return res.status(400).json({ error: "Aucun étudiant à répartir." });

        // 2. Générer les groupes
        const groups = await generateGroups(students);

        const finalResponse = [];

        // 3. Pour chaque groupe : créer un user + associer les étudiants
        for (const g of groups) {
            // (1) Générer identifiant interne provisoire
            const identifier = "group_" + crypto.randomBytes(4).toString("hex");

            // (2) Générer un mot de passe
            const passwordPlain = crypto.randomBytes(6).toString("base64");
            const passwordHash = await bcrypt.hash(passwordPlain, 10);

            // (3) Créer l'user/groupe
            const user = await User.create({
                name: identifier,       // ils pourront renommer plus tard
                password: passwordHash
            });

            // (4) Assigner les étudiants
            const studentIds = g.students.map(s => s.id);

            await Student.update(
                { groupId: user.id },
                { where: { id: studentIds } }
            );

            // (5) Préparer la réponse lisible
            finalResponse.push({
                groupId: user.id,
                login: identifier,
                password: passwordPlain,       // On l'envoie une fois !
                students: g.students
            });
        }

        return res.json(finalResponse);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la génération des groupes." });
    }
}


const generateGroups = async (students) => {

    const specialtyMap = {
        DW: "WEB", IW: "WEB",
        DA: "APP", AL: "APP",
        SR: "RESEAU", SRC: "RESEAU",
        DATA: "DATA",
        CS: "CYBER",
        SI: "BASEINFO"
    };

    const mapped = students.map(s => ({
        ...s.get({ plain: true }), // FORMAT PROPRE
        specialtyGroup: specialtyMap[s.specialty] || s.specialty
    }));

    // Séparation écoles
    let efficom = mapped.filter(s => s.school === "EFFICOM");
    let esgi = mapped.filter(s => s.school === "ESGI");
    let others = mapped.filter(s => s.school !== "EFFICOM" && s.school !== "ESGI");

    const shuffle = arr => arr.sort(() => Math.random() - 0.5);

    // Priorités école
    const effPriority = { DW: 1, DA: 1, SR: 2, SRC: 2, CS: 2, DATA: 2 };
    const esgiPriority = { SRC: 1, SI: 1, IW: 2, AL: 2, DATA: 2 };

    const prioritizedShuffle = (arr, priority) => {
        const buckets = {};
        arr.forEach(s => {
            const p = priority[s.specialty] ?? 99;
            (buckets[p] ||= []).push(s);
        });
        return Object.keys(buckets)
            .sort((a, b) => a - b)
            .flatMap(k => shuffle(buckets[k]));
    };

    efficom = prioritizedShuffle(efficom, effPriority);
    esgi = prioritizedShuffle(esgi, esgiPriority);
    shuffle(others);

    // ⛔ Fix du problème 6/4/1 → on construit la TAILLE DES GROUPES en premier

    const total = mapped.length;
    const groupSizeMin = 3;
    const groupSizeMax = 5;

    // Objectif = moyenne 4
    const groupCount = Math.ceil(total / 4);

    // Construire les tailles équilibrées
    const sizes = Array(groupCount).fill(Math.floor(total / groupCount));
    let rest = total % groupCount;

    // Ajouter 1 dans certains groupes pour atteindre la bonne somme
    let i = 0;
    while (rest > 0) {
        sizes[i]++;
        rest--;
        i = (i + 1) % groupCount;
    }

    // Créer les groupes vides avec leur capacité
    const groups = sizes.map(size => ({
        max: size,
        students: []
    }));

    // FONCTION pour mettre un étudiant dans le groupe le moins rempli
    const place = (student) => {
        const target = groups
            .filter(g => g.students.length < g.max)
            .sort((a, b) => a.students.length - b.students.length)[0];
        target.students.push(student);
    };

    // Phase A : mix école
    while (efficom.length || esgi.length) {
        if (efficom.length) place(efficom.shift());
        if (esgi.length) place(esgi.shift());
    }

    // Phase B : spécialités
    const byCat = {};
    others.forEach(s => {
        (byCat[s.specialtyGroup] ||= []).push(s);
    });

    Object.values(byCat).forEach(list => {
        shuffle(list);
        list.forEach(s => place(s));
    });


    return groups.map((g, idx) => ({
        group: idx + 1,
        students: g.students
    }));
}


exports.reinit = async (req,res) => {
    await Student.update({groupId: null},{where : {}});
    res.status(200).json();
}

exports.saveGroupName = async (req,res) => {
    let user = await User.update({username: req.body.username},{where: {id: req.params.id}});
    res.status(200).json(user);
}
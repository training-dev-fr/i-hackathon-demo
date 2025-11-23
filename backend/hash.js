const service = require('./modules/user/user.service');

const hash = async () => {
    let user = await service.create({
        username: "student",
        password: "student123!",
        is_admin: false
    })

    console.log('bdd : ' + user.password);
}

hash();


// const bcryptjs = require('bcryptjs');
// 
// let hash = bcryptjs.hashSync('admin123!',10);
// console.log('hash : ' + hash);
// console.log(bcryptjs.compareSync('admin123!',hash))
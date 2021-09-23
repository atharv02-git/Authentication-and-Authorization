const bcrypt = require('bcrypt')

const hashPassword = async(pw) => {
    // const salt = await bcrypt.genSalt(12);
    // Or you can pass salt rounds directly rather than generating
    const hash = await bcrypt.hash(pw, 12);
    console.log(`Hashed Password: ${hash}`)
}
const login = async(pw, hashPw) => {
    const result = await bcrypt.compare(pw, hashPw);
    if (result) {
        console.log('Log in sucessfull!')
    } else {
        console.log('Your credentials are incorrect!')
    }
}

// hashPassword('qwerty')
login('qwerty', '$2b$12$mTaqDUQ.b9dnOvBQ3Jv.GuxLNUdY746exqmvFXlWaaaQVyzLuXPry')
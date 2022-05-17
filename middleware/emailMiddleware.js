const nodemailer = require('nodemailer')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

const confirm_path = path.resolve(__dirname, '../emailMessages/confirm.ejs')
const change_path = path.resolve(__dirname, '../emailMessages/change.ejs')

const transporters = {
    transporter1: nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: 'pystorm.academy@gmail.com',
            pass: 'bembdycqaaazmcoc'
        },
        secure: true
    }),
    transporter2: nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: 'pystorm.company@gmail.com',
            pass: '<put_secret_key_here>'
        },
        secure: true
    }),
    transporter3: nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: 'pystorm.comp@gmail.com',
            pass: '<put_secret_key_here>'
        },
        secure: true
    }),
}

function sendConfirm(email, confirmLink) {
    return new Promise((resolve, reject) => {
        fs.readFile(confirm_path, {encoding: 'utf-8'}, async (err, ejsString) => {
            const htmlString = await ejs.render(ejsString, {link: confirmLink}, {async: true})
            if(err) {
                resolve('Error')
            }
            const mailData = {
                from: 'pystorm.academy@gmail.com',
                to: email,
                subject: 'PyStorm Academy подтверждение электронной почты',
                html: htmlString
            }
            console.time('transporter1')
            transporters.transporter1.sendMail(mailData, (err, info) => {
                if(err) {
                    mailData.from = 'pystorm.company@gmail.com'
                    transporters.transporter2.sendMail(mailData, (err, info) => {
                        if(err) {
                            mailData.from = 'pystorm.comp@gmail.com'
                            transporters.transporter3.sendMail(mailData, (err, info) => {
                                if(err) {
                                    resolve('Error')
                                    console.log(err)
                                } else {
                                    console.log('Transporter 3')
                                    resolve(3)
                                }
                            })
                        } else {
                            console.log('Transporter 2')
                            resolve(2)
                        }
                    })
                } 
                else { 
                    console.timeEnd('transporter1')
                    console.log('Transporter 1')
                    resolve(1)
                }
            })
        })
            
    })
}

function sendChange(email, name, changeLink) {
    return new Promise((resolve, reject) => {
        fs.readFile(change_path, {encoding: 'utf-8'}, async (err, ejsString) => {
            const htmlString = await ejs.render(ejsString, {name, link: changeLink}, {async: true})
            
            const mailData = {
                from: 'pystorm.academy@gmail.com',
                to: email,
                subject: 'PyStorm Academy изменение пароля',
                html: htmlString
            }
            console.time('transporter1')
            transporters.transporter1.sendMail(mailData, (err, info) => {
                if(err) {
                    mailData.from = 'pystorm.company@gmail.com'
                    transporters.transporter2.sendMail(mailData, (err, info) => {
                        if(err) {
                            mailData.from = 'pystorm.comp@gmail.com'
                            transporters.transporter3.sendMail(mailData, (err, info) => {
                                if(err) {
                                    resolve('Error')
                                    console.log(err)
                                } else {
                                    console.log('Transporter 3')
                                    resolve(3)
                                }
                            })
                        } else {
                            console.log('Transporter 2')
                            resolve(2)
                        }
                    })
                } else {
                    console.timeEnd('transporter1')
                    console.log('Transporter 1')
                    resolve(1)
                }
            })
        })
    })
}

module.exports = {
    sendConfirm,
    sendChange
}

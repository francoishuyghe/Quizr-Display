const {
    Settings,
    Emails
} = require('../model/settings')
const sgMail = require('@sendgrid/mail');

const emailTop = getFile("../static/resultEmailTop.html")
const emailMiddle = getFile("../static/resultEmailMiddle.html")
const emailBottom = getFile("../static/resultEmailBottom.html")

class SettingsControllers {

    //GET the settings
    async find(req, res, next) {
        try {
            console.log('Getting Settings');
            const {
                shop
            } = req.params
            const data = await Settings
                .findOne({
                    shop: shop
                })
                .populate('resultOptions')
                .populate({
                    path: 'questions',
                    populate: {
                        path: 'answers.negative',
                        model: 'ResultOption'
                    }
                })
                .populate({
                    path: 'questions',
                    populate: {
                        path: 'answers.positive',
                        model: 'ResultOption'
                    }
                })

            res.send(data ? data : {
                shop: shop
            })

        } catch (err) {
            next(err)
        }
    }

    //POST Send Email
    async sendEmail(req, res, next) {
        try {
            const data = req.body || {};
            const settings = data.state.settings

            const body = emailTop +
                settings.resultsTitle +
                settings.resultsParagraph +
                emailMiddle +
                emailBottom

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: data.email,
                from: 'info@savemefrom.com',
                subject: 'You product recommendations',
                html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            };
            sgMail.send(msg);

        } catch (err) {
            next(err)
        }
    }

    //PUT Save Email
    async saveEmail(req, res, next) {
        try {
            const data = req.body;
            console.log('In API route', data)

            Emails.update({
                shop: data.shop
            }, {
                $addToSet: {
                    emails: data.email
                }
            }, {
                upsert: true
            }, function (err) {
                console.log(err)
                res.send(data.email)
            });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new SettingsControllers();
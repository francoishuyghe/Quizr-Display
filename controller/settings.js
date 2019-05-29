const {
    Settings,
    Emails
} = require('../model/settings')
const sgMail = require('@sendgrid/mail');

var fs = require("fs");
const emailTop = fs.readFileSync(__dirname + "/../lib/resultEmailTop.html")
const emailMiddle = fs.readFileSync(__dirname + "/../lib/resultEmailMiddle.html")
const emailBottom = fs.readFileSync(__dirname + "/../lib/resultEmailBottom.html")

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
            const { settings, answer } = data.state
            const product = answer ? answer.product : {}

            const defaultProduct = settings.resultOptions.find((option) => {
                return option.defaultOption == true
            })

            var productSection = emailMiddle
            productSection = productSection
                .replace("PRODUCT1_IMG", product.image)
                .replace("PRODUCT1_TITLE", product.title)
                .replace("PRODUCT1_CAT", product.type)
                .replace("PRODUCT1_URL", product.onlineStoreUrl)
                .replace("PRODUCT2_IMG", defaultProduct.image)
                .replace("PRODUCT2_TITLE", defaultProduct.title)
                .replace("PRODUCT2_CAT", defaultProduct.type)
                .replace("PRODUCT2_URL", defaultProduct.onlineStoreUrl)

            const body = emailTop
                + '<h1>'
                + settings.resultsTitle
                + '</h1>'
                + '<p>'
                + settings.resultsParagraph
                + '</p>'
                + emailMiddle
                + emailBottom

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: data.email,
                from: {
                    email: 'info@savemefrom.com',
                    name: 'Save Me From™ team'
                },
                subject: 'You product recommendations',
                html: body
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
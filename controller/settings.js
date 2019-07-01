const {
    Settings,
    Stats
} = require('../model/settings')
const Coupons = require('../model/coupons')
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
            const {shop} = req.params
            const data = await Settings
                .findOne({
                    shop: shop + ".myshopify.com"
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

    //GET the coupons
    async findCoupons(req, res, next) {
        try {
            console.log('Getting Coupons');
            const {shop} = req.params
            const data = await Coupons
                .findOne({
                    shop: shop
                })
            console.log(data)
            res.send(data ? data : {})

        } catch (err) {
            next(err)
        }
    }

    //POST Send Email
    async sendEmail(req, res, next) {
        try {
            const data = req.body || {};
            const { domain, topAnswers, settings } = data.state
            const {couponToSend} = data

            const product1 = topAnswers[0] ? topAnswers[0].product : {}
            const product2 = topAnswers[1] ? topAnswers[1].product : {}

            const url1 = domain + '/products/' + product1.handle
            const url2 = domain + '/products/' + product2.handle

            var productSection = emailTop.toString()
            productSection = productSection
                .replace("RESULT_TITLE", settings.resultsTitle)
                .replace("RESULT_PARAGRAPH", settings.resultsParagraph)
                .replace("PRODUCT1_IMG", product1.image)
                .replace("PRODUCT1_TITLE", product1.title)
                .replace("PRODUCT1_CAT", product1.productType)
                .replace("PRODUCT1_URL", url1)
                .replace("PRODUCT2_IMG", product2.image)
                .replace("PRODUCT2_TITLE", product2.title)
                .replace("PRODUCT2_CAT", product2.productType)
                .replace("PRODUCT2_URL", url2)
            
            var promoSection = couponToSend.discountCode
                ? emailMiddle.toString()
                    .replace("DISCOUNT_TEXT", couponToSend.discountText)
                    .replace("DISCOUNT_CODE", couponToSend.discountCode)
                : ''
            
            const body = productSection
                + promoSection
                + emailBottom

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
                to: data.email,
                from: {
                    email: settings.resultEmail,
                    name: settings.resultEmailName
                },
                subject: settings.resultEmailTitle,
                html: body
            };
            sgMail.send(msg);
            res.send(msg)

        } catch (err) {
            console.log(err)
            next(err)
        }
    }

    //CHECK Email
    async checkEmail(req, res, next) {
        try {
            const {shop} = req.body
            console.log('Check Email', shop);
            Stats
                .findOne({
                    shop: shop
                }, (data) => { 
                    res.send(data)
                })
            

        } catch (err) {
            next(err)
        }
    }

    //PUT Save Email
    async saveEmail(req, res, next) {
        try {
            const data = req.body;
            console.log('In API route', data)

            Stats.updateOne({
                shop: data.shop
            }, {
                $addToSet: {
                    emails: data.email
                }
            }, {
                upsert: true
                }, function (err, data) {
                    console.log('save Route', err, data)
                    res.send({
                        err,
                        data
                    })
            });
        } catch (err) {
            next(err)
        }
    }
    
    //PUT Update Coupons
    async updateCoupons(req, res, next) {
        try {
            const data = req.body;
            console.log('In API route', data)

            Coupons.updateOne({
                shop: data.shop
            }, 
                data.updatedCoupons,
                function (err) {
                    console.log(err)
                    res.send(data.email)
                });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new SettingsControllers();
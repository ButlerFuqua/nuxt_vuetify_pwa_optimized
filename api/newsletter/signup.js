require('dotenv').config()
const axios = require('axios')

module.exports = async (req, res) => {

    const {
        email, first, last
    } = req.body


    const dc = 'us13'
    const aud_id = process.env.mailchimp_audience_id
    const api_key = process.env.mailchimp_api
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${aud_id}/members`


    try {

        const response = await axios.post(url, {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: first,
                LNAME: last
            }
        },
            {
                header: {
                    "content-type": "application / json"
                },

                auth: {
                    username: 'anystring',
                    password: api_key
                }
            })

        res.status(201).json({
            success: true,
            message: "You have successfully Subscribed! Please check your email and spam folder."
        })

    } catch (error) {
        console.log("ERROR SIGNING UP: ", error)

        let message
        let success

        if (
            error.response &&
            error.response.data &&
            error.response.data.title &&
            error.response.data.title.includes('Exists')) {
            message = `The requested email, ${email}, has already been signed up for this newsletter.`
            success = true
        } else {
            message = 'Sorry, there was an error processing your request.'
            success = false
        }


        return res.json({
            success,
            message
        })
    }


}
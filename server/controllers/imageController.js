import User from "../models/userModel.js";
import FormData from 'form-data';
import axios from 'axios';

export const generateImage = async (req, res) => {
    try {

        const userId = req.user;
        const { prompt } = req.body
        
        const user = await User.findById(userId);
        if (!user || !prompt) {
            return res.json({ success: false, message: "User not found or prompt missing" });
        }

        else if (user.creditBalance <= 0) {
            res.json({ success: false, message: "Insufficient Credits, Please recharge", creditBalance: user.creditBalance });
        }

        else{
            const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64');

        const resultImage = `data:image/png;base64,${base64Image}`;

        await User.findByIdAndUpdate(user._id, {creditBalance : user.creditBalance - 1});

        res.json({success : true, message : 'Image generated successfully', creditBalance : user.creditBalance - 1, resultImage});
        }

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
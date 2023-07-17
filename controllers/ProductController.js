import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";
import randomstring from "randomstring";

export const getProducts = async (req, res)=>{
    try {
        const response = await Product.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getProductById = async (req, res)=>{
    try {
        const response = await Product.findOne({
            where:{
                id: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const saveProduct = (req, res)=>{
    if (req.files === null) return res.status(400).json({msg: "No file upload"});
    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const extension = path.extname(file.name);
    // const fileName = file.md5 + extension;
    const fileName = `${randomstring.generate(6)}_${Date.now() + extension}`;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    // validasi extension file upload
    if(!allowedType.includes(extension.toLocaleLowerCase())) return res.status(422).json({msg: "Invalid image extension"});

    // lebih besar dari 1MB atau 1000000 Byte
    if(fileSize > 1000000) return res.status(422).json({msg: "Image must be less than 1MB"});

    // Upload file
    const dir = `./public/images/${fileName}`;
    file.mv(dir, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Product.create({name: name, image: fileName, url: url});
            res.status(201).json({msg: "Product save successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })
}

export const updateProduct = async (req, res)=>{
    const product = await Product.findOne({
        where:{
            id: req.params.id
        }
    });

    if(!product) return res.status(404).json({msg: "No data found"});

    let fileName = "";
    if(req.files === null) { // jika tidak upload file baru
        fileName = product.image; // field image data saat ini
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const extension = path.extname(file.name);
        // fileName = file.md5 + extension;
        fileName = `${randomstring.generate(6)}_${Date.now() + extension}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        // validasi extension file upload
        if(!allowedType.includes(extension.toLocaleLowerCase())) return res.status(422).json({msg: "Invalid image extension"});

        // lebih besar dari 1MB atau 1000000 Byte
        if(fileSize > 1000000) return res.status(422).json({msg: "Image must be less than 1MB"});

        const filePath = `./public/images/${product.image}`;
        if (fs.existsSync(filePath)) { // cek apakah file exist
            fs.unlinkSync(filePath); // menghapus file
        }

        // Upload file
        const dir = `./public/images/${fileName}`;
        file.mv(dir, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        })
    }

    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await Product.update({name: name, image: fileName, url: url}, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product updated successfully"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProduct = async (req, res)=>{
    const product = await Product.findOne({
        where:{
            id: req.params.id
        }
    });

    if(!product) return res.status(404).json({msg: "No data found"});

    try {
        const filePath = `./public/images/${product.image}`;
        if (fs.existsSync(filePath)) { // cek apakah file exist
            fs.unlinkSync(filePath); // menghapus file
        }
        
        
        await Product.destroy({ //menghapus data pada database
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Product delete successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}
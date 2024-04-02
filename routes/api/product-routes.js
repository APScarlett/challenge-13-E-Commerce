const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
//http://localhost:3001./api/products/
router.get('/', async (req,res) => {
  try{
    const productData = await Product.findAll({
      include: [{ model:Category}, {model: Tag, through: ProductTag}], //product tag is a cominbation of tag and category using the through
    });
    res.status(200).json(categoryData);
  }catch (err) {
    res.status(500).json(err);
  }
});

//http://localhost:3001/api/products/:id
//get a single product
router.get('/:id' async(req, res) =>{
//used to find a single product by its id
try{
  const productData = await Product.findByPk(req.params.id, {
    include:[{model:Category}, {model: Tag, through: ProductTag}]
  });

  if(!productData){
    res.status(404).json({message:'No product was found with that id!'})
    return;
  }
  res.status(200).json(productData);
}
catch(err){
  res.status(500).json(err);
}
});
module.exports = router;

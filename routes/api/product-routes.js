const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint


//http://localhost:3001./api/products/
 // find all products
router.get('/', async (req,res) => {
  try{
    const productData = await Product.findAll({
      include: [Category, {model: Tag, through: ProductTag}], //product tag is a cominbation of tag and category using the through
    });
    res.status(200).json(productData);
  }catch (err) {
    res.status(500).json(err);
  }
});

//http://localhost:3001/api/products/:id
//get a single product by its id
router.get('/:id', async(req, res) =>{
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


//http://localhost:3001/api/products/
//used to create a new product
router.post('/', (req,res)=> {
  Product.create(req.body).then((product)=>{
    if (req.body.tagIds?.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  })
  .then((productTagIds) => res.status(200).json(productTagIds))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

//http://localhost:3001/api/products/:id
//updating products
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });

            // figure out which ones to remove
          const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
                  // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
  });

  //http://localhost:3001/api/products/:id
  //delete a product using its id
  router.delete('/:id', async(req, res) => {
    try{
      const productData = await Product.destroy({
        where: {
          id: req.params.id
        },
      });
      if (!productData){
        res.status(400).json({message: 'No products were found with that ID!'});
      return;
      }
      res.status(200).json(productData);
    }
    catch(err) {
      res.status(500).json(err);
    }
  });

        

   

module.exports = router;

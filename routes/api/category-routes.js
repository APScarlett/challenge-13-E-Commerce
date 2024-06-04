const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint


//http://localhost:3001./api/categories
router.get('/', async (req,res) => { //find all categories
  try{
    const categoryData = await Category.findAll({
      include: [{ model:Product}],
    });
    res.status(200).json(categoryData);
  }catch (err) {
    res.status(500).json(err);
  }
});

//http://localhost:3001./api/categories/:id
router.get('/:id',async (req, res) => {
 try {
  const categoryData = await Category.findByPk(req.params.id, {
    include: [{model: Product}]
  });
  if (!categoryData){
    res.status(404).json({message: 'No category found with that id!'});
    return;
  }
  res.status(200).json(categoryData);
}
catch (err) {
  res.status(500).json(err);
}
});

//http://localhost:3001/api/categories/
//used to create a new category
router.post('/',async (req, res)=> {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err){
    res.status(400).json(err);
  }
});

//http:localhost:3001/api/categories/:id
// update a category by its `id` value
router.put('/:id', async (req, res) => {
  
  try{
    const categoryData = await Category.update({
      category_name:req.body.category_name
    },
    {
      where: {
        id: req.params.id,
      },
    });

    if(!categoryData){
      res.status(404).json({message: 'No category found with that id!'});
      return;
    }
    res.status(200).json(categoryData);
  }
  catch (err){
    res.status(500).json(err);
  }
});

//http://localhost:3001./api/categories/:id
//used to delete a category by its ID
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No reader found with that id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

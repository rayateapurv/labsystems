console.log('HI IM WORKING');

let title = document.querySelector('#title');
let para = document.querySelector('#para');

let ids = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
let title_texts = ['T-shirts', 'Shorts', 'Full-sleeved Shirts', 'Jeans', 'Trousers', 'Masalas', 'Dry Fruits', 'Medicines'];
let para_texts = [ 'Quantity: Twelve\nManufacturers: VOI Jeans, RIG Utility Clothing, BARE Denim, LEVI’S, aguante\nSizes: M, L, XL\nPrimary Material: Cotton, Polyester',
                    'Quantity: Five\nManufacturers: Puma, Jockey, Van Heusen\nSizes: M\nPrimary Material: Cotton, Polyester',
                    'Quantity: Seven\nManufacturers: Mufti, Jack and Jones, Arrow\nSizes: 39, 40, 42\nPrimary Material: Cotton',
                    'Quantity: Three\nManufacturers: United Colors of Benetton, Indian Terrain\nSizes: 32, 30\nPrimary Material: Denim',
                    'Quantity: Five\nManufacturers: Indian Terrain, Jack and Jones, U. S. Polo Assn.\nSizes: 30, 32\nPrimary Material: Woven Wool, Flannel',
                    'Quantity: Five packs\nManufacturers: MTR, Everest, Nestle, Ching’s\nPrimary Ingredients: Chilli Pepper, Coriander, Cumin, Black Pepper',
                    'Quantity: Two kilograms\nManufacturers: Locally sourced\nTypes: Cashews, Almonds, Walnuts, Raisins', 
                    'Quantity: Thirteen packs\nManufacturers: Crocin, Sinarest, Combiflam\nPrimary Ingredients: Paracetamol, Antibiotics, Acetaminophen'
]

ids.forEach((value, index) => {
    $(function() {
        $("body").click(function(e) {
            if (e.target.id == value || $(e.target).parents("#" + value).length) {
                //console.log("Inside div");
                title.innerText = title_texts[index];
                para.innerText = para_texts[index];
            } else {
                //console.log("Outside div");
            }
        });
    })
});


var app = new Vue({
    el: '#app',
    data: {
        product: 'Socks',
        description: 'These are some mighty fine socks!',
        image: './assets/vmSocks-green-onWhite.jpg',
        link: 'https://www.google.com',
        inventory: 0,
        onSale: true,
        details: ["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
            {
                variantId: 2234,
                variantColor: "green"
            },
            {
                variantId: 2235,
                variantColor: "blue"
            }
        ],
        sizes: ["small", "medium", "large", "xl", "xxl"]
    }
});

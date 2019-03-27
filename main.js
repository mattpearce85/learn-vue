Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
});

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" />
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else :class="{ crossedOut: !inStock }">Out of Stock</p>
                <p>{{ saleMessage }}</p>
                <p>{{ description }}</p>
                <p><strong>Link:</strong> <a :href="link">{{ link }}</a></p>
                <p>Shipping: {{ shipping }}</p>

                <product-details :details="details"></product-details>

                <div
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)"
                >
                </div>

                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>

                <button
                    @click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
                >Add to Cart</button>
                <button
                    @click="removeFromCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
                >Remove from Cart</button>

                <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            description: 'These are some mighty fine socks!',
            selectedVariant: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            link: 'https://www.google.com',
            inventory: 0,
            onSale: false,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0
                }
            ],
            sizes: ["small", "medium", "large", "xl", "xxl"],
            cart: 0
        }
    },
    methods: {
        addToCart: function () {
            this.cart += 1;
        },
        removeFromCart: function () {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct: function (index) {
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        saleMessage() {
            var message = this.brand + ' ' + this.product + ' ';
            if (this.onSale) {
                message += 'is on sale!';
            } else {
                message += 'is not on sale...'
            }
            return message;
        },
        shipping() {
            var cost = '2.99';
            if (this.premium) {
                cost = 'Free';
            }
            return cost;
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
});

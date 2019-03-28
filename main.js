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
            </div>

            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>Recommendation: {{ review.recommend }}</p> 
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <product-review @review-submitted="addReview"></product-review>
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
                    variantQuantity: 5
                }
            ],
            sizes: ["small", "medium", "large", "xl", "xxl"],
            reviews: []
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart: function () {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct: function (index) {
            this.selectedVariant = index;
        },
        addReview(productReview) {
            this.reviews.push(productReview);
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

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" type="text" v-model="name" />
            </p>
            
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
            
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>Would you recommend this product?<br />
                <label>Yes <input type="radio" value="Yes" v-model="recommend" /></label>
                <label>No <input type="radio" value="No" v-model="recommend" /></label>
            </p>
            
            <p>
                <input type="submit" value="Submit" />
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                this.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if (!this.name) {
                    this.errors.push('Name required.');
                }
                if (!this.review) {
                    this.errors.push('Review required.');
                }
                if (!this.rating) {
                    this.errors.push('Rating required.');
                }
                if (!this.recommend) {
                    this.errors.push('Recommendation required.');
                }
            }
        }
    }
});

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        decrementCart(id) {
            for (var i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                    break;
                }
            }
        }
    }
});

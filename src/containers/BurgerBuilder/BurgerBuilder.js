import React, {Component} from 'react';

import Aux from '../../hoc/Auxilliary/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-my-burger-b530e.firebaseio.com/ingredients.json')
        .then(res => {
            this.setState({ingredients: res.data});
        })
        .catch(err => {
            this.setState({error: true});
        })
    }

    updatePurchaseState(ingredients) {
        const sum = Object.values(ingredients).reduce((sum,el)=>{
            return sum + el;
        },0);
        this.setState({purchasable: sum>0});
    }

    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
    }

    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        });
    }

    purchaseContinueHandler = () => {
        this.setState({
            loading: true
        })

        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Yasachandra Bansal',
                address: {
                    street: 'Sarjapur Road',
                    zipCode: 560103,
                    country: 'India'
                },
                email: 'yasachandra@gmail.com'
            },
            deliveryMethod: 'fastest'
        };

        axios.post('/orders.json',order)
        .then(resp => {
            this.setState({
                loading: false,
                purchasing: false
            });
            console.log(resp);
        })
        .catch(err => {
            this.setState({
                loading: false,
                purchasing: false
            });
            console.log(err);
        })
    }

    addIngredientHandler = (type) => {
        const updatedIngredients = {...this.state.ingredients};
        const updatedCount = this.state.ingredients[type] + 1;
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const updatedPrice = this.state.totalPrice + priceAddition;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const updatedIngredients = {...this.state.ingredients};
        const updatedCount = this.state.ingredients[type] - 1;
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const updatedPrice = this.state.totalPrice - priceDeduction;

        this.setState({
            ingredients: updatedIngredients,
            totalPrice: updatedPrice
        });
        this.updatePurchaseState(updatedIngredients);
    }

    render() {
        const disabledInfo = {...this.state.ingredients}
        for(let key in disabledInfo)
            disabledInfo[key] = disabledInfo[key] <= 0;
        
        let orderSummary = null

        let burger = this.state.error ? <p>We can't fetch the ingredients right now!</p> : <Spinner />
        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        addIngredient={this.addIngredientHandler}
                        removeIngredient={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            )

            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients} 
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.state.totalPrice}
        />
        }

        if(this.state.loading)
            orderSummary = <Spinner />

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default WithErrorHandler(BurgerBuilder,axios);
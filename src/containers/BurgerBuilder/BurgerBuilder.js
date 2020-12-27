import React, {Component} from 'react';

import Aux from '../../hoc/Auxilliary/Auxilliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from "../../store/actions";
import { connect } from 'react-redux';

export class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // axios.get('https://react-my-burger-b530e.firebaseio.com/ingredients.json')
        // .then(res => {
        //     this.setState({ingredients: res.data});
        // })
        // .catch(err => {
        //     this.setState({error: true});
        // })
    }

    updatePurchaseState() {
        const sum = Object.values(this.props.ings).reduce((sum,el) => {
            return sum + el;
        }, 0);
        return sum > 0;
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
        this.props.history.push("/checkout");
    }

    render() {
        const disabledInfo = {...this.props.ings}
        for(let key in disabledInfo)
            disabledInfo[key] = disabledInfo[key] <= 0;
        
        let orderSummary = null

        let burger = this.state.error ? <p>We can't fetch the ingredients right now!</p> : <Spinner />
        if(this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls
                        addIngredient={this.props.onIngredientAdded}
                        removeIngredient={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState()}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            )

            orderSummary = <OrderSummary 
            ingredients={this.props.ings} 
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.props.price}
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

const mapStateToProps = (state) => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (name) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: name }),
        onIngredientRemoved: (name) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: name })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder,axios));
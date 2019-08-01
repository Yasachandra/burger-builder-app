import React, {useState} from "react";

import Aux from '../Auxilliary/Auxilliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import classes from './Layout.css';

const layout = props => {
    const [state,setState] = useState({
        showSideDrawer: false
    });

    const sideDrawerClosedHandler = () => {
        setState({
            showSideDrawer: false
        });
    }

    const toggleSideDrawer = () => {
        const show = state.showSideDrawer;
        setState({
            showSideDrawer: !show
        })
    }

    return (
        <Aux>
            <Toolbar toggleMenu={toggleSideDrawer} />
            <SideDrawer open={state.showSideDrawer} closed={sideDrawerClosedHandler}/>
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )
}

export default layout;
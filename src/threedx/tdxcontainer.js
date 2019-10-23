import React from 'react';
import TdxLoader from './tdxloader';

const styles = {
    tdxcontainer: {
        position: `absolute`,
        left: `0px`,
        top: `0px`,
        width: `100%`,
        height: `100%`
    }
}

class TdxContainer extends React.Component {
    componentDidMount() {
        
        this.tdx = TdxLoader( this.tdxRootElement );
        
    }

    render() {
        return (
            <div id="tdxplayer-container" 
                style={ styles.tdxcontainer }
                ref={ element => this.tdxRootElement = element } 
            />
        )
    }
}
export default TdxContainer;
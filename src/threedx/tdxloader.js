
const addJScript = (url) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
}

export default containerElement => {
    
    const init = () => {
        console.log("init loader")
        
        // setup event listener
        window.addEventListener("tdxEvent", (evt) => {
            console.log("REACT | tdxEvent2", evt);
            
            switch(evt.detail.name) {
                case 'TDXONINITIALIZED':
                    TdxOnInitiliazed();
                    break;
                default:
            }

        });
        
        // add threedx main script
        addJScript('./js/tdxmain.js');

        // check if script is properlly loaded
        checkTdxScript()
            .then(result => checkTdxScript())
            .then(result => {
                
                // now load the player
                window.callFromReact(containerElement.id);

                return true;
            })
            .catch(err => console.log('There was an error:' + err))
    }

    const sendMessage = (data) => {
        window.sendMessage(data);
    }

    const TdxOnInitiliazed = () => {
        console.log("TDXONINITIALIZED");

        // load room
        sendMessage({
            action: "Reload",
            param: "http://localhost:3000/tdx/3dx/room000.fls"
        });
    }

    function checkTdxScript(onSuccess, onFail) {
        return new Promise((resolve, reject) => {
          setTimeout(function() {
            var result = window.connectPromise();
            result ? resolve(result) : reject('Error');
          }, 100);
        })
    }

    const testReturn = () => {
        console.log("test return")
    }

    const testAgain = () => {
        console.log("test again")
    }

    init();

    return {
        testReturn,
        testAgain
    }
}
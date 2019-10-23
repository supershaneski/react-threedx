
const addJScript = (url) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
}

function baseObject(doc) {
    this.obj = doc;
    this.id = doc.getAttribute("id");
    this.getSummary = function(key) {
        var summary, node, value;
        try{
            summary = this.obj.getElementsByTagName("summary");
            node = summary[0].getElementsByTagName(key);
            value = node[0].firstChild.nodeValue;
        } catch(err){
        }
        return value;
    }
    return this;
}

export default containerElement => {
    
    const init = () => {
        console.log("init loader")
        
        // setup event listener
        window.addEventListener("tdxEvent", (evt) => tdxEventHandler(evt));
        
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

    const tdxEventHandler = (evt) => {
        switch(evt.detail.name) {
            case 'TDXONINITIALIZED':
                tdxOnInitiliazed();
                break;
            case 'TDXONLOAD':
                tdxOnLoad();
                break;
            case 'TDXONCLICK':
                tdxOnClick(evt.detail.param);
                break;
            case 'TDXONDESELECT':
                tdxOnDeselect();
                break;
            default:
        }
    }

    const loadVariationFile = (item) => {
        console.log("LOAD VARIATION FILE", item);

        // let's load the xml variation file
        fetch('./tdx/xml/' + item + '.xml',{
            method: "GET",
            headers: {
                'Accept': 'text/xml',
                'Content-Type': 'text/xml'
            },
          })
            .then(result => {
                if(!result.ok) {
                    throw Error("i got an error");
                }
                return result.text()
            })
            .then(txt => readVariationFile(txt),
                error => console.log("eror", error));
    }

    const readVariationFile = (rawTxt) => {
        var dom = new DOMParser();
        var xml = dom.parseFromString(rawTxt, 'text/xml');
        var root = xml.getElementsByTagName("furniture");
        if(root.length === 0) return;
        
        //console.log(root.length, root[0].getAttribute("id"))
        //selected = root[0];
        
        const furn = new baseObject(root[0]);
        //console.dir(furn);
        const name = furn.getSummary("name");
        const id = furn.id;
        console.log(id, name);
    }

    const tdxOnDeselect = () => {
        console.log("TDXONDESELECT");
    }

    const tdxOnClick = (sAttr) => {
        console.log("TDXONCLICK", sAttr);

        // get only item name
        const n = sAttr.indexOf(":");
        const item = (n >= 0)?sAttr.substr(0,n):sAttr;

        // load variation file
        loadVariationFile(item);
    }

    const tdxOnLoad = () => {
        console.log("TDXONLOAD");
    }

    const tdxOnInitiliazed = () => {
        console.log("TDXONINITIALIZED");

        // load room
        sendMessage({
            action: "Reload",
            param: "http://localhost:3000/tdx/3dx/room001.fls"
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
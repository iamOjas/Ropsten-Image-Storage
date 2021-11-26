import React, {
  useEffect,
  useState
} from "react";
import ImageStorageContract from "./contracts/ImageStorage.json";
import getWeb3 from "./getWeb3";
import "./App.css";

const { create } = require('ipfs-http-client')
const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

var App = () => {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [Contract, setContract] = useState(undefined);
    const [buffer, setBuffer] = useState(null);
    const [paths, addPath] = useState([]);

  useEffect(() => {
    const init = async() => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = "0x87B5F9dc07500ACF02e519CBCDfaeA9e6D80cc5b";
        const instance = new web3.eth.Contract(
          ImageStorageContract.abi,
          deployedNetwork
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        // this.setState({ web3, accounts, contract: instance }, this.runExample);
        setWeb3(web3);
        setAccounts(accounts);
        setContract(instance);

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, [])

  useEffect(() => {
    const init = async() => {
        
        // await Contract.methods.set(value).send({
        //   from: accounts[0]
        // });

        const response = await Contract.methods.imageCount().call();

        // Update state with the result.
        console.log(response)
        for(var i=1;i<=response;i++)
        {
          let imagepath = await Contract.methods.images(i).call();
          addPath(path => {return [...path,imagepath]});
        }
  
      }
      if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof Contract !== 'undefined') {
      init();
    }

  }, [web3, accounts, Contract])

  if(typeof web3 === 'undefined'){
    return <div> Loading Web3, accounts, and contract... </div>;
  }

  const handleImage = (event) =>{
    event.preventDefault();
    const file = event.target.files[0]
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () =>{
      setBuffer(Buffer(reader.result));
    }
  }

  async function handleSubmit(event){
    event.preventDefault();

     const file = await ipfs.add(buffer);
    console.log(file.path);
    await Contract.methods.set(file.path).send({
      from: accounts[0]
    });

    window.location.reload(false);

  }
  

  return(
    <div className="App" >
    <h1>Image Storage DAPP</h1>
    <form onSubmit ={handleSubmit}>
      <input type="file"
      onChange = {handleImage}      
      />
      <button type="submit">Submit</button>
    </form>
    {
      paths.map(path => {return <img src={`https://ipfs.infura.io/ipfs/${path}`} alt="" srcset="" />})
    }
  </div>
  )

}

export default App;
# PmknFarm Frontend
After deployment, the list of requisite addresses will be logged into your terminal. Add the addresses to the frontend/src/App.js file inside the correct load contract functions. They will look like this:
```
const loadPmknFarmContract = useCallback(async(_provider) => {
    let pmknFarmAddress = "PMKNFARM_CONTRACT_HERE"
    let contract = new ethers.Contract(pmknFarmAddress, PmknFarm.abi,_provider)
    setPmknFarmContract(contract)
    }, [setPmknFarmContract])
```
***
Copy/paste the ABIs from the Pmkn-farm/artifacts directory into the Pmkn-farm/frontend/src/abis directory. 
Inside the Pmkn-farm/frontend directory:
```
npm i
```
before finally:
```
npm run start
```

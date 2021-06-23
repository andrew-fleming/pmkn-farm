# PmknFarm Frontend
After deployment, the list of requisite addresses will be logged into your terminal. Add the addresses to the frontend/src/App.js file inside the correct load contract functions. They will look like this:
```
const loadPmknFarmContract = useCallback(async(_provider) => {
    let pmknFarmAddress = "0x..."
    let contract = new ethers.Contract(pmknFarmAddress, PmknFarm.abi,_provider)
    setPmknFarmContract(contract)
    }, [setPmknFarmContract])
```
***
Inside the Pmkn-farm/frontend directory:
```
npm i
```
before finally:
```
npm run start
```

#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, contracterror, Env, Address, token};

#[contracttype]
enum DataKey {
    ContractInit,
    Balance,
    OwnerAddress,
}

#[contracttype]
pub enum State {
    NotInProgress,
    InProgress,
    CompletedAndReset,
}

// -------------- ERRORS -------------- // 

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    NotInitalised = 1,
    InvalidNewOwnerAddress = 2,
    AlreadySigned = 3,
    InsufficientFunds = 4,
}

#[contract]
 pub struct RecoveryWalletContract;

#[contractimpl]
impl RecoveryWalletContract {

    pub fn init(e: Env, owner: Address) -> Result<(), Error> {
        
        e.storage().instance().set(&DataKey::OwnerAddress, &owner);
        e.storage().instance().set(&DataKey::ContractInit, &true);

        Ok(())
    }
 
 // Deposit function   
    pub fn deposit(e: Env,from: Address,token: Address,amount: i128) -> Result<(), Error> {

        if !Self::initialised(&e) {
            return Err(Error::NotInitalised)
        }

        token::Client::new(&e, &token).transfer(&from, &e.current_contract_address(), &amount);
        let balance = e.storage().instance().get(&DataKey::Balance).unwrap_or(0);
        e.storage().instance().set(&DataKey::Balance, &(balance + amount));
    
        Ok(())
    }


// Withdraw Function
    pub fn withdraw(e: Env,token: Address,amount: i128) -> Result<(), Error>  {

        if !Self::initialised(&e) {
            return Err(Error::NotInitalised)
        }

        let owner: Address = e.storage().instance().get(&DataKey::OwnerAddress).unwrap();
            owner.require_auth();
        let balance = e.storage().instance().get(&DataKey::Balance).unwrap_or(0);

        if balance < amount {
            return Err(Error::InsufficientFunds);
        }

        token::Client::new(&e, &token).transfer(&e.current_contract_address(),&owner,&&amount,);
        e.storage().instance().set(&DataKey::Balance,  &(balance - amount)); 

        Ok(())
    }
 

 // Calling of functions
    fn initialised(e: &Env) -> bool {
        return e.storage().instance().get::<DataKey, bool>(&DataKey::ContractInit).unwrap_or(false);
    }
    
    pub fn get_owner(e: Env) -> Address{
        e.storage().instance().get(&DataKey::OwnerAddress).unwrap()
    }
    
    pub fn get_balance(e: Env) -> i128 {
        e.storage().instance().get(&DataKey::Balance).unwrap_or(0)
    }

    pub fn get_ledger_time(e: Env) -> u64 {
        e.ledger().timestamp()
    }
}
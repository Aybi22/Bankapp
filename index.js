let currentAccount;
let bank = createBank();
let accounts;

document.addEventListener("DOMContentLoaded", () => {
  let accountList = document.querySelector(".account-list");

  //When you save data to localStorage:JavaScript removes all methods only raw data properties remain the object is no longer an “Account”, just a plain object

  let newAccountObj = function (account) {
    let owner = account.owner;
    let balance = account.balance; //localStorage stores strings

    return {
      getOwner() {
        return owner;
      },

      deposit(amount) {
        balance += amount;
      },

      withdraw(amount) {
        balance -= amount;
      },
      transfer(sender, receiver, amount) {
        sender.withdraw(amount);
        receiver.deposit(amount);
      },

      getBalance() {
        return balance;
      },
    };
  };

  let savedAccounts = JSON.parse(localStorage.getItem("accountArr")) || []; //read all saved account data from storage
  console.log(savedAccounts);

  savedAccounts.forEach((account) => {
    let newAccount = newAccountObj(account);
    //“For each saved account:I recreate a real account object from its data
    //give that recreated account to the bank
    bank.setAccount(newAccount);

    accountList.innerHTML += `
  <div class="name">
<p> Name</p>
<p class="owner-name">${newAccount.getOwner()}</p>

</div>
<div class="balance">
<p>Balance:</p>
<p class="owner-balance">£${newAccount.getBalance()}</p>
</div>
</div>
`;

    for (let i = 0; i < accountList; i++) {
      if (i === 3) {
        break;
      }
    }
    let depositBox = document.getElementById("deposit-box");

    depositBox.innerHTML = `<p class="amount-text"><span class="owner">${newAccount.getOwner()}</span> <span class="balance">£${newAccount.getBalance()}</span></p>`;
    return;
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("deposit-btn")) {
      depositCurrentAccount();
    }
    if (e.target.classList.contains("withdraw-btn")) {
      document.body.style.backgroundColor = "pink";
      withdrawals();
    }
    if (e.target.classList.contains("transfer-btn")) {
      document.body.style.backgroundColor = "pink";
      transfer();
    }
    if (e.target.classList.contains("find")) {
      findAccount();
    }

    function depositCurrentAccount() {
      let input = document.querySelector(".account-name");
      let owner = input.value;

      let sumInput = document.querySelector(".amount-field");
      let amount = parseFloat(sumInput.value);
      if (!amount || amount <= 0) {
        let balance = currentAccount.balance;
        let feedback = document.querySelector(".feedback");
        feedback.innerHTML = `<p class="error">Amount is not valid <span class="error-icon">X</span></p>`;

        let depositBox = document.getElementById("deposit-box");

        depositBox.innerHTML = `<p class="amount-text"><span class="owner">${owner}</span> <span class="balance">£${balance}</span></p>`;
        return;
      }
      currentAccount.deposit(amount);
      owner = currentAccount.getOwner();
      let balance = currentAccount.getBalance();
      let feedback = document.querySelector(".feedback");
      feedback.innerHTML = `<p class="success">Thank you, ${owner}. You have deposited £${amount}. Your balance is now £${balance} <i class="fa-solid fa-check"></i></p>`;

      let depositBox = document.getElementById("deposit-box");

      depositBox.innerHTML = `<p class="amount-text"><span class="owner">${owner}</span> <span class="balance">£${balance}</span></p>`;
      updateAccount();
    }

    function withdrawals() {
      let sumInput = document.querySelector(".amount-field");

      enableBtn();

      if (!currentAccount) {
        document.body.style.backgroundColor = "yellow";
        feedback.innerHTML = `<p class="error">Please, create an account before withdrawing!<span class="error-icon">X</span></p>`;
        return;
      }
      let amount = parseInt(sumInput.value);
      if (!amount || amount <= 0) {
        feedback.innerHTML = `<p class="error">Amount is not valid!<span class="error-icon">X</span></p>`;

        return;
      }
      let balance = currentAccount.getBalance();
      amount = parseInt(sumInput.value);

      if (amount > balance) {
        document.body.style.backgroundColor = "red";
        feedback.innerHTML = `<p class="error"> Insufficient funds!<span class="error-icon">X</span></p>`;
        return;
      }

      if (currentAccount && amount) {
        document.body.style.backgroundColor = "violet";
        let sumInput = document.querySelector(".amount-field");
        let input = document.querySelector(".account-name");
        let amount = parseInt(sumInput.value);
        let owner = input.value;
        owner = currentAccount.getOwner(owner);

        currentAccount.withdraw(amount);
        let balance = currentAccount.getBalance();
        let depositBox = document.getElementById("deposit-box");
        depositBox.innerHTML = `<p class="amount-text">${owner}<span class="balance"> £${balance}</span></p>`;

        feedback.innerHTML = `<p class="success"> Withdrew: £${amount}, Balance: £${balance}! <i class="fa-solid fa-check"></i></p>`;
      }
    }

    function transfer() {
      if (!currentAccount) {
        feedback.innerHTML = `<p class="error">Please, create an account before making a transfer <span class="error-icon">X</span></p>`;
      }

      let transferAmount = document.querySelector(".transfer-amount");
      let receiverInput = document.querySelector(".receiver");
      let senderInput = document.querySelector(".sender");

      let transAmount = parseInt(transferAmount.value);
      let receiver = receiverInput.value.trim().toLowerCase();
      let sender = senderInput.value.trim().toLowerCase();

      let findSender = bank
        .showAllAccounts()
        .find((account) => account.getOwner() === sender);
      let findReceiver = bank
        .showAllAccounts()
        .find((account) => account.getOwner() === receiver);
      let balance = currentAccount.getBalance();

      if (!findSender && !findReceiver) {
        let feedback = document.querySelector(".feedback");
        feedback.innerHTML = `<p class="error">No account found<span class="error-icon">X</span></p> `;
        return; //stop the function.
      }

      if (receiverInput.value === "") {
        feedback.innerHTML = `<p class="error">Receiver account not found<span class="error-icon">X</span></p> `;
      }

      if (senderInput.value === "") {
        feedback.innerHTML = `<p class="error">Sender account not found<span class="error-icon">X</span></p> `;
      }

      if (receiverInput.value === senderInput.value) {
        feedback.innerHTML = `<p class="error">you can only transfer between different accounts!<span class="error-icon">X</span> </p>`;

        return;
      }
      if (findSender.getBalance() === 0) {
        feedback.innerHTML = `<p class="error">No enough funds to make transfer<span class="error-icon">X</span> </p>`;
        return;
      }

      if (!transAmount) {
        feedback.innerHTML = `<p class="error">Enter amount before making transfer<span class="error-icon">X</span> </p>`;
        return; //stop the function.
      }

      if (
        transAmount > findSender.getBalance() ||
        findSender.getBalance() === 0
      ) {
        let feedback = document.querySelector(".feedback");
        feedback.innerHTML = `<p class="error">insufficient funds<span class="error-icon">X</span></p> `;
        return; //stop the function.
      }
      if (findSender && findReceiver && transAmount) {
        bank.transfer(sender, receiver, transAmount);
        let receiverBalance = findReceiver.getBalance();
        let balance = findSender.getBalance();
        let depositBox = document.getElementById("deposit-box");
        depositBox.innerHTML = `<p class="amount-text">${sender}: <span class="balance">£${balance}</span></p>
    <i class="fa-solid fa-arrow-right-long"></i><p class="receiver">${receiver} ${receiverBalance}</p>`;

        let feedback = document.querySelector(".feedback");
        feedback.innerHTML = `<p class="success">Thank you ${sender}, you successfully sent  £${transAmount} to ${receiver}, your balance is now: £${balance} <i class="fa-solid fa-check"></i> </p>`;

        updateAccount();
      }
    }
  });

  function findAccount() {
    let input = document.querySelector(".account-name");
    let owner = input.value;

    let accountFound = bank
      .showAllAccounts()
      .find((accounts) => accounts.getOwner() === owner);
    currentAccount = accountFound;
    if (currentAccount) {
      let balance = currentAccount.getBalance();
      let owner = currentAccount.getOwner();

      feedback.innerHTML = `<p class="success">account found, balance:£${balance}<i class="fa-solid fa-check"></i> </p>`;
      let depositBox = document.getElementById("deposit-box");
      depositBox.innerHTML = `<p class="amount-text"><span class="owner">${owner}</span> <span class="balance">£${balance}</span></p>`;
    }

    if (!currentAccount) {
      feedback.innerHTML = `<p class="error">No account found<i class="fa-solid fa-check"></i> </p>`;

      updateAccount();
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("create")) {
      console.log("clicked:", e.target.classList);
      showForm();

      setAccount();
    }
  });
  function showForm() {
    let accountForm = document.querySelector(".account-form");
    accountForm.style.display = "block";
  }

  let feedback = document.querySelector(".feedback");
  function clearInput() {
    let input = document.querySelector(".account-name");
    let sumInput = document.querySelector(".amount-field");
    input.value = "";
    sumInput.value = "";
  }

  function setAccount() {
    let input = document.querySelector(".account-name");
    let owner = input.value.trim().toLowerCase();

    if (!input.value) {
      return;
    }

    if (!bank.findOwner(owner)) {
      currentAccount = bank.createAccount(owner);

      let balance = currentAccount.getBalance();
      bank.setAccount(currentAccount);
      localStorage.setItem(
        "accountArr",
        JSON.stringify(
          bank.showAllAccounts().map((acc) => ({
            owner: acc.getOwner(),
            balance: acc.getBalance(),
          }))
        )
      );

      feedback.innerHTML = `<p class="success"> Thank you to create a new account <span class="owner"> ${owner}</span>, your balance is £${balance} <i class="fa-solid fa-check"></i></p>`;

      let depositBox = document.getElementById("deposit-box");
      depositBox.innerHTML = `<p class="amount-text"><span class="owner">${owner}</span> <span class="balance">£${balance}</span></p>`;

      updateAccount();
    } else {
      //“Hey bank, please store this new account for this owner inside your accounts list.”

      feedback.innerHTML = `<p class="error">You already have an account<span class="error-icon">X</span></p>`;
    }
  }

  function updateAccount() {
    let accountList = document.querySelector(".account-list");
    let allAccounts = bank.showAllAccounts();
    accountList.innerHTML = "";
    allAccounts.forEach((accounts) => {
      let newDiv = document.createElement("div");
      newDiv.innerHTML = `
  

<div class="name">
<p> Name</p>
<p class="owner-name">${accounts.getOwner()}</p>

</div>
<div class="balance">
<p>Balance:</p>
<p class="owner-balance">£${accounts.getBalance()}</p>
</div>
</div>
`;
      localStorage.setItem("savedName", accounts.getOwner());
      localStorage.setItem("savedBalance", accounts.getBalance());

      accountList.appendChild(newDiv);
      let ownerName = document.querySelector(".owner-name");
      console.log(ownerName);
    });
  }
});

/*
function depositMoney() {
  let sumInput = document.querySelector(".amount-field");
  let input = document.querySelector(".account-name");
  let owner = input.value;
  enableBtn();
  let accountFound = bank
    .showAllAccounts()
    .find((accounts) => accounts.getOwner() === owner);
  let userAccount = accountFound;
  localStorage.setItem("activeAccount", userAccount);
  let amount = parseFloat(sumInput.value);

  if (!userAccount) {
    feedback.innerHTML = `<p class="error">Please, create an account before depositing<span class="error-icon">X</span></p>`;
    return;
  }
  if (!amount || amount <= 0) {
    feedback.innerHTML = `<p class="error">Please, add amount before depositing<span class="error-icon">X</span></p>`;
    return;
  }

  if (userAccount) {
    let sumInput = document.querySelector(".amount-field");

    let amount = parseInt(sumInput.value);
    userAccount.deposit(amount);

    let balance = Number(userAccount.getBalance());
    feedback.innerHTML = `<p class="success">Thank you, ${owner}. You have deposited £${amount}. Your balance is now £${balance} <i class="fa-solid fa-check"></i></p>`;
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text"><span class="owner">${owner}</span><span class="balance">£${balance}</span></p>`;
    updateAccount();
    sumInput.value = "";
  }
}
  */

console.log(bank.showAllAccounts().length);
function disableBtn() {
  let button = document.querySelector(".deposit-btn");
  button.disabled = true;
}

function enableBtn() {
  let button = document.querySelector(".deposit-btn");
  button.disabled = false;
}

/*
  if (accountFound) {
    let sumInput = document.querySelector(".amount-field");
    let amount = parseInt(sumInput.value);
    accountFound.deposit(amount);
let accountOwner = userAccount.getOwner();
    let depositBox = document.getElementById("deposit-box");
    depositBox.innerHTML = `<p class="amount-text">${owner}: £${balance}</p>`;

    updateAccount();
  }
}
  */

function createAccount(owner) {
  let balance = 0;
  return {
    getOwner() {
      return owner;
    },

    deposit(amount) {
      return (balance += parseFloat(amount));
    },

    withdraw(amount) {
      if (balance > amount || balance === amount) {
        return `${owner} withdrew ${amount}.Remaining balance:£${(balance -=
          amount)}`;
      }
      if (amount > balance) {
        return `insufficient funds`;
      }
    },
    getBalance() {
      return balance;
    },
  };
}

function createBank() {
  let accounts = [];

  return {
    createAccount(owner) {
      return createAccount(owner);
    },
    setAccount(account) {
      if (!accounts.includes(account)) accounts.push(account);
    },

    findOwner(owner) {
      //accounts.find(...) searches through the vault (the array of accounts).For each account, it asks who owns this account by calling getOwner().When it finds a match, it returns the entire account object.
      let findOwner = accounts.find((account) => account.getOwner() === owner);
      return findOwner; //it gives you the whole account object that contains deposit(), withdraw(), getBalance(), etc.
    },

    transfer(senderName, receiverName, amount) {
      let sender = this.findOwner(senderName); //use the findOwner method that belongs to this same bank.”
      let receiver = this.findOwner(receiverName);

      sender.withdraw(amount);
      receiver.deposit(amount);
    },
    showAllAccounts() {
      return accounts;
    },
  };
}

import { FunctionalComponent } from "preact";
import { html } from 'htm/preact';
import { useState, useContext, useEffect } from 'preact/hooks';
import { useObserver } from 'mobx-react-lite';
import { Link, route } from 'preact-router';

import { StoreContext } from 'index'
import { algodClient } from 'services/algodClient'
import TransactionsList from 'components/Account/TransactionsList'
import AssetsList from 'components/Account/AssetsList'
import AccountDetails from 'components/Account/AccountDetails'


const Account: FunctionalComponent = (props: any) => {
  const store:any = useContext(StoreContext);
  const { url, ledger, address } = props;
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [showAssets, setShowAssets] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);

  let account;

  for (var i = store[ledger].length - 1; i >= 0; i--) {
    if (store[ledger][i].address === address) {
      account = store[ledger][i];
      break;
    }
  }

  const fetchApi = async () => {
    let res = await algodClient[ledger].accountInformation(address).do();
    if (res) {
      setResults(res);
    }
  }

  useEffect(() => {
    fetchApi();
  }, []);

  return html`
    <div class="px-4 py-3 has-text-weight-bold ">
      <p class="is-size-5" style="overflow: hidden; text-overflow: ellipsis;">
        <a class="icon mr-2" onClick=${() => route('/wallet')}>${'\u003C'}</a>
        ${account.name} Account
        <button class="button is-outlined is-small"
          style="float: right;" onClick=${()=>setShowDetails(true)}>
          ${'\u22EE'}
        </button>
      </p>
      <span>
        Balance:
        ${ results && html`
          ${results.amount} MAlgos
        `}
      </span>
    </div>
    <div class="px-4">
      <${Link} class="button is-primary is-fullwidth" href=${`${url}/send`}>
        Send Algos
      </${Link}>
    </div>

    ${ results && results.assets.length > 0 && html`
      <${AssetsList} assets=${results.assets} ledger=${ledger}/>
    `}

    <${TransactionsList} address=${address} ledger=${ledger}/>

    <div class=${`modal ${showDetails ? 'is-active' : ''}`}>
      <div class="modal-background"></div>
      <div class="modal-content" style="padding: 0 15px; max-height: calc(100vh - 95px);">
        <div class="box" style="overflow-wrap: break-word;">
          <${AccountDetails} account=${account} ledger=${ledger} />
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" onClick=${()=>setShowDetails(false)} />
    </div>
  `
};

export default Account;
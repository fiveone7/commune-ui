import type { Domain, EvmResource, SubstrateResource} from '@buildwithsygma/sygma-sdk-core';
import { Environment } from '@buildwithsygma/sygma-sdk-core';
import type { ApiPromise } from '@polkadot/api';
import type { Signer } from '@polkadot/api/types';
import type { HTMLTemplateResult } from 'lit';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import type { WalletConnectOptions } from '@web3-onboard/walletconnect/dist/types';
import type { AppMetadata } from '@web3-onboard/common';
import { communeLogo } from './assets';
import './components';
import './components/address-input';
import './components/amount-selector';
import { BaseComponent } from './components/common/base-component/base-component';
import './components/transfer/fungible/fungible-token-transfer';
import './components/network-selector';
import './context/wallet';
import type { Eip1193Provider, ICommuneWidget, Theme } from './interfaces';
import { styles } from './styles';
  
@customElement('commune-widget')
class CommuneWidget extends BaseComponent implements ICommuneWidget
  {
    static styles = styles;
  
    @property({ type: String }) environment?: Environment;
  
    @property({ type: Array }) whitelistedSourceNetworks?: string[];
  
    @property({ type: Array }) whitelistedDestinationNetworks?: string[];
  
    @property({ type: Object }) evmProvider?: Eip1193Provider;
  
    @property() substrateProvider?: ApiPromise | string;
  
    @property({ type: Object }) substrateSigner?: Signer;
  
    @property({ type: Boolean }) show?: boolean;
  
    @property({ type: Array }) whitelistedSourceResources?: Array<
      EvmResource | SubstrateResource
    >;
  
    @property({ type: Boolean }) expandable?: boolean;
  
    @property({ type: Boolean }) darkTheme?: boolean;
  
    @property({ type: Object }) customLogo?: SVGElement;
  
    @property({ type: Object }) theme?: Theme;
  
    @property({ type: Object }) walletConnectOptions?: WalletConnectOptions;
  
    @property({ type: Object }) appMetadata?: AppMetadata;
  
    @state()
    private isLoading = false;
  
    @state()
    private sourceNetwork?: Domain;
  
    private renderConnect(): HTMLTemplateResult {
      if (this.sourceNetwork) {
        return html`
          <commune-connect-wallet-btn
            .sourceNetwork=${this.sourceNetwork}
          ></commune-connect-wallet-btn>
        `;
      }
      return html``;
    }
  
    connectedCallback(): void {
      super.connectedCallback();
      const env = import.meta.env.VITE_BRIDGE_ENV ?? Environment.MAINNET;
      if (Object.values(Environment).includes(env as Environment)) {
        this.environment = env as Environment;
      } else {
        throw new Error(
          `Invalid environment value, please choose following: ${Object.values(Environment).join(', ')}`
        );
      }
    }
  
    render(): HTMLTemplateResult {
      return html`
        <commune-config-context-provider
          .appMetadata=${this.appMetadata}
          .theme=${this.theme}
          .walletConnectOptions=${this.walletConnectOptions}
        >
          <commune-wallet-context-provider>
            <section
              class="widgetContainer ${this.isLoading ? 'noPointerEvents' : ''}"
            >
              <section class="widgetHeader">
                <div class="brandLogoContainer title">COMAI Transfer</div>
                ${this.renderConnect()}
              </section>
              <section class="widgetContent">
                <commune-fungible-transfer
                  .environment=${this.environment as Environment}
                  .onSourceNetworkSelected=${(domain: Domain) =>
                    (this.sourceNetwork = domain)}
                  .whitelistedSourceResources=${this.whitelistedSourceNetworks}
                  environment=${Environment.TESTNET}
                >
                </commune-fungible-transfer>
              </section>
              <section class="poweredBy">${communeLogo} Powered by Commune</section>
              ${when(
                this.isLoading,
                () => html`<commune-overlay-component></commune-overlay-component>`
              )}
            </section>
          </commune-wallet-context-provider>
        </commune-config-context-provider>
      `;
    }
  }
  
  export { CommuneWidget };
  
  declare global {
    interface HTMLElementTagNameMap {
      'commune-widget': ICommuneWidget;
    }
  }
  
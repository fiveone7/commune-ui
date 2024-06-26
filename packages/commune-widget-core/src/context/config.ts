import { customElement, property } from 'lit/decorators.js';
import { createContext, ContextProvider } from '@lit/context';
import type { WalletConnectOptions } from '@web3-onboard/walletconnect/dist/types';
import type { HTMLTemplateResult, PropertyValues } from 'lit';
import { html } from 'lit';
import type { AppMetadata } from '@web3-onboard/common';
import { BaseComponent } from '../components/common/base-component';
import type { Theme } from '../interfaces';

export interface ConfigContext {
  theme?: Theme;
  walletConnectOptions?: WalletConnectOptions;
  appMetaData?: AppMetadata;
}

export const configContext = createContext<ConfigContext>(
  Symbol('commune-config-context')
);

@customElement('commune-config-context-provider')
export class ConfigContextProvider extends BaseComponent {
  private configContextProvider = new ContextProvider(this, {
    context: configContext,
    initialValue: {}
  });

  @property({ attribute: false, type: Object })
  walletConnectOptions?: WalletConnectOptions;

  @property({ attribute: false, type: Object })
  appMetadata?: AppMetadata;

  @property({ attribute: false, type: Object })
  theme?: Theme;

  connectedCallback(): void {
    super.connectedCallback();

    this.configContextProvider.setValue({
      theme: this.theme,
      walletConnectOptions: this.walletConnectOptions,
      appMetaData: this.appMetadata
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('theme')) {
      this.configContextProvider.setValue({
        ...this.configContextProvider.value,
        theme: this.theme
      });
    }
  }

  protected render(): HTMLTemplateResult {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementEventMap {
    'commune-config-context-provider': ConfigContextProvider;
  }
}

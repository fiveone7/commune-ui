import type { HTMLTemplateResult } from 'lit';
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { when } from 'lit/directives/when.js';

import { loaderIcon } from '../../../assets';
import { BaseComponent } from '../base-component/base-component';

import { buttonStyles } from './button.styles';

@customElement('commune-action-button')
export class Button extends BaseComponent {
  static styles = buttonStyles;

  @property({})
  text: string = '';

  @property({ type: Object })
  onClick: () => void = () => {};

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean })
  isLoading: boolean = false;

  renderLoadingSpinner(): HTMLTemplateResult {
    return when(this.isLoading, () => loaderIcon);
  }

  render(): HTMLTemplateResult {
    const buttonClasses = classMap({
      button: true,
      disabled: this.disabled,
      loading: this.isLoading
    });

    return html`<button
      type="button"
      ?disabled="${this.disabled}"
      @click=${this.disabled || this.isLoading ? undefined : this.onClick}
      class=${buttonClasses}
    >
      ${this.renderLoadingSpinner()} ${this.text}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'commune-action-button': Button;
  }
}

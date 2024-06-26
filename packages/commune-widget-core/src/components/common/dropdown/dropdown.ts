import type { PropertyValues, HTMLTemplateResult } from 'lit';
import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';

import { chevronIcon, networkIconsMap } from '../../../assets';
import { capitalize } from '../../../utils';
import { BaseComponent } from '../base-component/base-component';

import { styles } from './styles';

export interface DropdownOption<T = Record<string, unknown>> {
  id?: string;
  name: string;
  icon?: HTMLTemplateResult | string;
  value: T;
}

@customElement('dropdown-component')
export class Dropdown extends BaseComponent {
  static styles = styles;

  @state()
  isDropdownOpen = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  label? = '';

  @property({ type: Array })
  options: DropdownOption[] = [];

  @state()
  selectedOption: DropdownOption | null = null;

  @property({ attribute: false })
  onOptionSelected: (option?: DropdownOption) => void = () => {};

  connectedCallback(): void {
    super.connectedCallback();
    addEventListener('click', this._handleOutsideClick);
  }

  disconnectedCallback(): void {
    super.connectedCallback();
    removeEventListener('click', this._handleOutsideClick);
  }

  updated(changedProperties: PropertyValues<typeof this>): void {
    super.updated(changedProperties);
    //if options changed, check if we have selected option that doesn't exist
    if (changedProperties.has('options') && this.selectedOption) {
      if (
        !this.options.map((o) => o.value).includes(this.selectedOption.value)
      ) {
        this.selectedOption = null;
      }
    }
  }

  _handleOutsideClick = (event: MouseEvent): void => {
    if (this.isDropdownOpen && !event.composedPath().includes(this)) {
      document.removeEventListener('click', this._handleOutsideClick);
      this.isDropdownOpen = false;
    }
  };

  _toggleDropdown = (): void => {
    if (!this.disabled) {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  };

  _selectOption(option: DropdownOption, event: Event): void {
    if (this.disabled) return;

    event.stopPropagation();
    this.selectedOption = option;
    this._toggleDropdown();
    this.dispatchEvent(
      new CustomEvent('option-selected', { detail: { value: option.value } })
    );
    this.onOptionSelected(option);
  }

  _renderTriggerContent(): HTMLTemplateResult | undefined {
    return when(
      this.selectedOption,
      () =>
        html`${this.selectedOption!.icon || networkIconsMap.default}
          <span part="optionName" class="optionName">
            ${capitalize(this.selectedOption!.name)}
          </span>`,
      () =>
        when(
          this.placeholder,
          () => html`<span class="placeholder">${this.placeholder}</span>`
        )
    );
  }

  _renderOptions(): Generator<unknown, void> {
    return map(
      this.options,
      (option) => html`
        <div
          class="dropdownOption"
          @click="${(e: Event) => this._selectOption(option, e)}"
          role="option"
        >
          ${option.icon || ''}
          <span class="optionName">${capitalize(option.name)}</span>
        </div>
      `
    );
  }

  render(): HTMLTemplateResult {
    return html`
      <div
        part="dropdownWrapper"
        class="${this.disabled
          ? 'dropdownWrapper disabled'
          : 'dropdownWrapper'}"
      >
        <label for="selector" class="dropdownLabel">${this.label}</label>
        <div
          class="dropdown"
          @click="${this._toggleDropdown}"
          role="listbox"
          tabindex="0"
          aria-expanded="${this.isDropdownOpen ? 'true' : 'false'}"
        >
          <div
            class="${this.disabled
              ? 'dropdownTrigger disabled'
              : 'dropdownTrigger'}"
          >
            <div class="selectedOption">${this._renderTriggerContent()}</div>
            <div class="chevron ${this.isDropdownOpen ? 'open' : ''}">
              ${chevronIcon}
            </div>
          </div>
          <div
            class="dropdownContent ${this.isDropdownOpen ? 'show' : ''}"
            role="list"
          >
            ${this._renderOptions()}
          </div>
        </div>
      </div>
    `;
  }
}

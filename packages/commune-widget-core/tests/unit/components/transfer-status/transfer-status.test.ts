import { fixture, fixtureCleanup } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { afterEach, assert, describe, it } from 'vitest';
import { TransferStatus } from '../../../../src/components/transfer/fungible/transfer-status';

describe('transfer-status-component', function () {
  afterEach(() => {
    fixtureCleanup();
  });

  it('is defined', () => {
    const el = document.createElement('commune-transfer-status');
    assert.instanceOf(el, TransferStatus);
  });

  it('renders transfer-status', async () => {
    const el = await fixture(html`
      <commune-transfer-status
        .sourceNetworkName=${'khala'}
        .destinationNetworkName=${'cronos'}
        .amount=${1234099943}
        .tokenDecimals=${6}
        .resourceSymbol=${'wCOMAI'}
        .explorerLinkTo=${'some-url'}
      ></commune-transfer-status>
    `);

    const transferStatus = el.shadowRoot!.querySelector(
      '.transferStatusContainer'
    ) as HTMLElement;

    assert.isNotNull(transferStatus);
  });
});

/**
 * Basic e2e tests for GitHub to pass
 *
 * @group github
 */

describe('Basic Happy Path Tests', () => {
  const extensionName = 'AlgoSigner';
  const extensionPopupHtml = 'index.html';
  const unsafePassword = 'c5brJp5f';
  const unsafeMenmonic =
    'grape topple reform pistol excite salute loud spike during draw drink planet naive high treat captain dutch cloth more bachelor attend attract magnet ability heavy';
  const testNetAccount = 'E2E-Tests';

  // Shared vars, set in beforeAll
  let baseUrl;
  let page;

  jest.setTimeout(15000);

  beforeAll(async () => {
    page = await browser.newPage();
    const targets = await browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
      return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
    });

    const extensionUrl = extensionTarget._targetInfo.url || '';
    const [, , extensionID] = extensionUrl.split('/');
    baseUrl = `chrome-extension://${extensionID}/${extensionPopupHtml}`;

    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    await page.goto(baseUrl, { waitUntil: 'networkidle0' });
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  test('Welcome Page Title', async () => {
    await expect(page.title()).resolves.toMatch(extensionName);
  });

  test('Create New Wallet', async () => {
    await page.waitForSelector('#setPassword');
    await page.evaluate(() => document.querySelector('#setPassword').click());
  });

  test('Set new wallet password', async () => {
    await expect(page.$eval('.mt-2', (e) => e.innerText)).resolves.toMatch(
      'my_1st_game_was_GALAGA!'
    );
    await page.waitForSelector('#createWallet');
    await page.type('#setPassword', unsafePassword);
    await page.type('#confirmPassword', unsafePassword);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/test_pre-create.png' });
    await page.click('#createWallet', { clickCount: 2, delay: 200 });
    await page.screenshot({ path: 'screenshots/test_itner-create.png' });
    await page.evaluate(() => document.querySelector('#createWallet').click());
    await page.screenshot({ path: 'screenshots/test_post-create.png' });
  });

  test('Switch Ledger', async () => {
    await page.waitForTimeout(4000);
    await page.screenshot({
      path: 'screenshots/test_looking-for-ledger.png',
    });
    await page.waitForSelector('#selectLedger');
    await page.evaluate(() => document.querySelector('#selectLedger').click());
    await page.waitForTimeout(500);
    await page.waitForSelector('#selectTestNet');
    await page.evaluate(() => document.querySelector('#selectTestNet').click());
  });

  test('Import Account', async () => {
    await page.waitForSelector('#addAccount');
    await page.click('#addAccount');
    await page.waitForSelector('#importAccount');
    await page.click('#importAccount');
    await page.waitForSelector('#accountName');
    await page.type('#accountName', testNetAccount);
    await page.waitForTimeout(100);
    await page.type('#enterMnemonic', unsafeMenmonic);
    await page.waitForTimeout(100);
    await page.click('#nextStep');
    await page.waitForSelector('#enterPassword');
    await page.type('#enterPassword', unsafePassword);
    await page.waitForTimeout(200);
    await page.click('#authButton');
    // Loading the account takes time
    await page.waitForTimeout(3000);
  });
});

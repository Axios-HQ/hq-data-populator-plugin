const base_host = 'https://api.example.com'; // Set your base host here or make it dynamic

export const routes = {
  createUser: `${base_host}/create-test-user`,
  createDemoOrg: `${base_host}/create-demo-org`,
  updateNonPaidOrg: `${base_host}/non-paid-org`,
  createCard: `${base_host}/card`,
  createOrg: `${base_host}/create-org`,
  updateSeries: `${base_host}/update-series`,
  subscribeUsers: `${base_host}/subscribe-users`,
  aboutMe: `${base_host}/about-me`, // This is a GET request
  removeSendPermissions: `${base_host}/remove-send-permissions`, // This is a DELETE request
  createEdition: `${base_host}/create-edition`,
  healthcheck: `${base_host}/healthcheck`,
  createTemplate: `${base_host}/create-template`,
};

export default routes;

// https://editor-stage.axioshq.dev/ == https://preprod-data-populator.axioshq.dev
// https://test-shared-plus-web-client-4253-editor.axioshq.dev/  == https://test-shared-plus-web-client-4253-data-populator.axioshq.dev
// https://test-private-plus-web-client-4253-editor.axioshq.dev/ == https://test-private-plus-web-client-4253-data-populator.axioshq.dev
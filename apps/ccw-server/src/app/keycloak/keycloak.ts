import * as KeycloakAdminClient from '@keycloak/keycloak-admin-client';

export const keycloakConfig = {
  realm: 'master',
  clientId: 'admin-cli',
  clientSecret: '85gBBxo1Ock9vl0dmcnfAdikT6e1Cerk',
  baseUrl: 'http://192.168.1.42:8080',
  loginUrl:
    'http://192.168.1.42:8080/auth/realms/master/protocol/openid-connect',
  logoutUrl:
    'http://192.168.1.42:8080/realms/master/protocol/openid-connect/logout',
  tokenUrl:
    'http://192.168.1.42:8080/realms/master/protocol/openid-connect/token',
  loginCallbackUri: '/callback',
  logoutCallbackUri: '/logout',
};

export const keycloakAdminClient = async function (username?:string,password?:string) {
    console.log(username,password)
  const kcAdminClient = new KeycloakAdminClient.default({
    baseUrl: keycloakConfig.baseUrl,
    realmName: keycloakConfig.realm,
  });

  if(username==undefined || password==undefined) await kcAdminClient.auth({
    username: 'admin',
    password: 'admin',
    grantType: 'password',
    clientId: 'admin-cli',
  });

  else await kcAdminClient.auth({
    username: username,
    password: password,
    grantType: 'password',
    clientId: 'admin-cli',
    clientSecret: '85gBBxo1Ock9vl0dmcnfAdikT6e1Cerk'
  })

  return kcAdminClient;
};
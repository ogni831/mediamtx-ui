import Setting from "./Setting.js";

export default class AuthSettings extends Setting {
    constructor(settings) {
        super(settings, 'auth');

        this.fields = [
            'authMethod',
            'authHTTPAddress',
            'authHTTPExclude',
            'authJWTJWKS',
            'authJWTClaimKey'
        ];

        this.options = {
            authMethod: ['internal', 'http', 'jwt']
        };
    }
}

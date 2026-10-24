import Setting from "./Setting.js";

export default class AuthSettings extends Setting {
    constructor(settings) {
        super(settings, 'auth');

        this.fields = [
            'authMethod',
            'authHTTPAddress',
            'authHTTPFingerprint',
            'authHTTPExclude',
            'authJWTJWKS',
            'authJWTClaimKey',
            'authJWTJWKSFingerprint',
            'authJWTExclude',
            'authJWTIssuer',
            'authJWTAudience'
        ];

        this.options = {
            authMethod: ['internal', 'http', 'jwt']
        };
    }
}

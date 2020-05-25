export class GenericModelError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GenericModelError";
    }
}

export class ModelParameterError extends GenericModelError {
    constructor(message: string) {
        super(message);
        this.name = "ModelParameterError";
    }
}

type CallbackWrapper = <T>(query: () => T) => Promise<any>;

export const tryQuery: CallbackWrapper = async (cb) => {
    try {
        return cb();
    }
    catch (err) {
        throw new GenericModelError(err);
    }
};

export const globalSchemaOptions = {
    toObject: {
        transform: function (doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc: any, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    }
};
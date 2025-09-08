interface Serializer<P, R> {

    serialize(value: P, type: typeof value): P extends Readonly<infer T> ? Readonly<T> : R;

}

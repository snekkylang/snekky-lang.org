function getUrlArgument(name) {
    const args = new URL(window.location.href);
    return args.searchParams.get(name);
}
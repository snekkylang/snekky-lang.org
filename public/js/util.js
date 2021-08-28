function getUrlArgument(name) {
    const args = new URL(window.location.href.replace(/#/g, "?"));
    return args.searchParams.get(name);
}
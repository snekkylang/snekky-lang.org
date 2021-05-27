<script>
    let [version, sha, date] = Snekky.Version.split(" ");
    sha = sha.replace("[", "").replace("]", "");
</script>

<pre class="version">Version: {version} <a target="_blank" href="https://github.com/snekkylang/snekky/commit/{sha}">[{sha}]</a></pre>

<style>
    .version {
        margin: 20px 10px 20px 0;
        display: flex;
        align-items: flex-end;
        font-size: 12px;
        font-weight: 600;
        color: #5A5A58;
    }

    a:visited,
    a {
        text-decoration: none;
        color: #0364dd;
        font-weight: 600;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
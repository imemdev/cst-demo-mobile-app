(function () {
  "use strict";
  function filtered(state, rows, keys) {
    const q = state.search.toLowerCase();
    return rows.filter((row) =>
      keys.some((key) => String(row[key]).toLowerCase().includes(q)),
    );
  }
  function paginate(state, rows) {
    return rows.slice(
      (state.page - 1) * state.pageSize,
      state.page * state.pageSize,
    );
  }
  CST.list = { filtered, paginate };
})();

// Minimal compatibility shim to help migrate Bootstrap 3 → Bootstrap 5
// Provides:
// - conversion of data- attributes: data-toggle/data-target/data-dismiss -> data-bs-*
// - a tiny jQuery plugin wrapper for $.fn.modal(...) that maps to bootstrap.Modal

(function() {
  // Convert legacy data-* attributes to Bootstrap 5 equivalents on DOM load.
  function convertDataAttributes() {
    var mappings = [
      ['data-toggle', 'data-bs-toggle'],
      ['data-target', 'data-bs-target'],
      ['data-dismiss', 'data-bs-dismiss']
    ];
    mappings.forEach(function(pair) {
      var oldAttr = pair[0];
      var newAttr = pair[1];
      document.querySelectorAll('[' + oldAttr + ']').forEach(function(el) {
        if (!el.hasAttribute(newAttr)) {
          el.setAttribute(newAttr, el.getAttribute(oldAttr));
        }
        // keep the old attribute for compatibility
      });
    });
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', convertDataAttributes);
  else
    convertDataAttributes();

  // jQuery plugin compatibility for modal
  if (window.jQuery && window.bootstrap && typeof window.bootstrap.Modal === 'function') {
    (function($){
      var _oldModal = $.fn.modal;
      $.fn.modal = function(actionOrOptions) {
        // If calling like $('#id').modal('show') or modal('hide')
        if (typeof actionOrOptions === 'string') {
          var action = actionOrOptions;
          return this.each(function() {
            var el = this;
            var inst = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el);
            if (action === 'show') inst.show();
            else if (action === 'hide') inst.hide();
            else if (action === 'toggle') {
              // No direct toggle in BS5 API
              try { inst.toggle(); } catch (e) { inst.show(); }
            }
          });
        } else {
          var opts = actionOrOptions || {};
          return this.each(function() {
            var el = this;
            var inst = bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el, opts);
            inst.show();
          });
        }
      };

      // Keep ability to restore original if needed
      $.fn.modal.noConflict = function() {
        $.fn.modal = _oldModal;
        return $.fn.modal;
      };
    })(window.jQuery);
  }
})();

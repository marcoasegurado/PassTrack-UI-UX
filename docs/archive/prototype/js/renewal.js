/* Shared right-hand rail for the four passport renewal steps. */
(function () {
  const host = document.querySelector("[data-renewal-rail]");
  if (!host) return;

  host.innerHTML =
    '<section class="rail-card">' +
      '<h3>Requirements checklist</h3>' +
      '<ul class="rail-list">' +
        '<li><span class="icon">' + PTui.icon("check-circle", 18) + '</span> Copy of your current passport (data page)</li>' +
        '<li><span class="icon">' + PTui.icon("check-circle", 18) + '</span> One valid government-issued ID</li>' +
        '<li><span class="icon">' + PTui.icon("check-circle", 18) + '</span> Proof of name change, if applicable</li>' +
        '<li><span class="icon">' + PTui.icon("check-circle", 18) + '</span> Processing fee, paid at your appointment</li>' +
      '</ul>' +
    '</section>' +
    '<section class="rail-card">' +
      '<h3>Processing time &amp; fees</h3>' +
      '<div class="rail-row"><span>Regular · 10–12 working days</span><strong>₱950</strong></div>' +
      '<div class="rail-row"><span>Express · 5–7 working days</span><strong>₱1,200</strong></div>' +
      '<div class="note-box" style="margin-top:10px">' +
        '<span class="icon">' + PTui.icon("info", 14) + '</span>' +
        '<span>Fees are paid at your appointment. Courier delivery is optional and billed separately.</span>' +
      '</div>' +
    '</section>' +
    '<section class="rail-card">' +
      '<h3>Need help?</h3>' +
      '<p class="hint">Questions about your renewal? Our support team replies within one business day.</p>' +
      '<a class="btn btn--primary btn--block" style="margin-top:14px;height:44px;min-height:44px;font-size:15px;text-transform:uppercase;letter-spacing:.4px;font-weight:700" href="inquiries.html?new=1">Contact support</a>' +
    '</section>';
})();

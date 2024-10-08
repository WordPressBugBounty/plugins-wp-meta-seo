/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var title_max_len = 60;
var desc_max_len = 143;
var keywords_max_len = 256;
var metaseoValueHolder = {};

/**
 * Set option when disable search engines from indexing this site
 * @param option
 * @param hide
 * @param nonce
 */
function wpmsIgnore(option, hide, nonce) {
    jQuery.post(ajaxurl, {
            action: "wpms_set_ignore",
            wpms_nonce: wpms_localize.wpms_nonce
        }, function (data) {
            if (data) {
                jQuery("#" + hide).hide();
            }
        }
    )
}

/**
 * Clean meta
 * @param str string need clean
 * @returns {*}
 */
function metaseo_clean(str) {
    if (str === '' || typeof str === "undefined")
        return '';
    try {
        str = jQuery('<div/>').text(str).text();
        str = str.replace(/<\/?[^>]+>/gi, '');
        str = str.replace(/\[(.+?)\](.+?\[\/\\1\])?/g, '');
    } catch (e) {
    }

    return str;
}

var oldTitleValues = {};
var oldKeywordsValues = {};
var oldDescValues = {};

/**
 * Update length number of meta title for post, page, custom post type
 * @param metatitle_id string id of element tag
 * @param updateSnippet
 */
function metaseo_titlelength(metatitle_id, updateSnippet) {
    var title = (metaseo_clean(jQuery('#' + metatitle_id).val())).trim();
    var postid = metatitle_id.replace('metaseo-metatitle-', '');
    var counter_id = 'metaseo-metatitle-len' + postid;
    jQuery('#' + counter_id).text(title_max_len - title.length);
    if (title.length >= title_max_len) {
        jQuery('#' + counter_id).removeClass('word-74B6FC').addClass('word-exceed');//#FEFB04
    } else if (title.length <= 50) {
        jQuery('#' + counter_id).removeClass('word-exceed').addClass('word-74B6FC');//#74B6FC
    } else {
        jQuery('#' + counter_id).removeClass('word-exceed word-74B6FC');
    }

    if (title.length > title_max_len) {
        jQuery('#snippet_title' + postid).empty().text(title.substr(0, title_max_len));
    }

    if (typeof updateSnippet === "undefined" || updateSnippet !== false) {
        jQuery('#snippet_title' + postid).text(title.substr(0, title_max_len));
    }
}

/**
 * Update meta title for post, page, custom post type
 * @param metatitle_id string id of element tag
 * @param needToSave
 */
function metaseo_updateTitle(metatitle_id, needToSave) {
    var title = (metaseo_clean(jQuery('#' + metatitle_id).val())).trim();
    var postid = metatitle_id.replace('metaseo-metatitle-', '');
    if (needToSave === true && oldTitleValues[postid] !== title) {
        saveMetaContentChanges('metatitle', postid, title);
    }

    //Push the new value into the array
    oldTitleValues[postid] = title;
}

/**
 * Update length number of meta keyword for post, page, custom post type
 * @param metakeywords_id string id of element tag
 */
function metaseo_keywordlength(metakeywords_id) {
    var keywords = (metaseo_clean(jQuery('#' + metakeywords_id).val())).trim();
    var postid = metakeywords_id.replace('metaseo-metakeywords-', '');

    var counter_id = 'metaseo-metakeywords-len' + postid;
    jQuery('#' + counter_id).text(keywords_max_len - keywords.length);

    if (keywords.length >= keywords_max_len) {
        jQuery('#' + counter_id).addClass('word-exceed');
    } else {
        jQuery('#' + counter_id).removeClass('word-exceed');
    }
}

/**
 * Update meta keyword for post, page, custom post type
 * @param metakeywords_id string id of element tag
 * @param needToSave
 */
function metaseo_updatekeywords(metakeywords_id, needToSave) {
    var keywords = (metaseo_clean(jQuery('#' + metakeywords_id).val())).trim();
    var postid = metakeywords_id.replace('metaseo-metakeywords-', '');
    if (needToSave === true && oldKeywordsValues[postid] !== keywords) {
        saveMetaContentChanges('metakeywords', postid, keywords);
    }

    //Push the new value into the array
    oldKeywordsValues[postid] = keywords;
}


/**
 * remove link
 * @param link_id id of this link
 */
function wpmsRemoveLink(link_id) {
    jQuery.ajax({
        url: ajaxurl,
        method: 'POST',
        dataType: 'json',
        data: {
            'action': 'wpms',
            'task': 'remove_link',
            'link_id': link_id,
            'wpms_nonce': wpms_localize.wpms_nonce
        },
        success: function (response) {
            if (response.status) {
                jQuery('#record_' + link_id).remove();
            }
        }
    });
}

/**
 * Update meta title for link
 * @param button_update
 */
function saveMetaLinkChanges(button_update) {
    var link_id = jQuery(button_update).closest('tr').data('link');
    var meta_title = jQuery(button_update).closest('tr').find('.metaseo_link_title').val();
    meta_title = (metaseo_clean(meta_title)).trim();
    jQuery.ajax({
        url: ajaxurl,
        method: 'POST',
        dataType: 'json',
        data: {
            'action': 'wpms',
            'task': 'update_link',
            'link_id': link_id,
            'meta_title': meta_title,
            'wpms_nonce': wpms_localize.wpms_nonce
        },
        success: function (response) {
            jQuery(button_update).closest('tr').find('.wpms_update_link').hide();
            if (response !== false) {
                jQuery(button_update).closest('tr').find('.wpms_old_link').val(response.link_new).change();
                jQuery(button_update).closest('tr').find('.wpms_mesage_link').show().fadeIn(3000).delay(200).fadeOut(3000);
            } else {
                jQuery(button_update).closest('tr').find('.wpms_error_mesage_link').show().fadeIn(3000).delay(200).fadeOut(3000);
            }

        }
    });
}

/**
 * Update index for page
 * @param page_id int page ID
 * @param index int index value
 */
function metaseo_update_pageindex(page_id, index) {
    jQuery.ajax({
        url: ajaxurl,
        method: 'POST',
        dataType: 'json',
        data: {
            'action': 'wpms',
            'task': 'update_pageindex',
            'page_id': page_id,
            'index': index,
            'wpms_nonce': wpms_localize.wpms_nonce
        }
    });
}

/**
 * Update follow for page
 * @param page_id int page ID
 * @param follow int follow value
 */
function metaseo_update_pagefollow(page_id, follow) {
    jQuery.ajax({
        url: ajaxurl,
        method: 'POST',
        dataType: 'json',
        data: {
            'action': 'wpms',
            'task': 'update_pagefollow',
            'page_id': page_id,
            'follow': follow,
            'wpms_nonce': wpms_localize.wpms_nonce
        }
    });
}

/**
 * update follow for link
 * @param button
 */
function wpmsChangeFollow(button) {
    var link_id = jQuery(button).closest('tr').data('link');
    var type = jQuery(button).data('type');
    var follow = 1;
    if (type === 'done') {
        jQuery(button).data('type', 'warning').html('warning');
        jQuery(button).removeClass('wpms_ok').addClass('wpms_warning');
        follow = 0;
    } else {
        jQuery(button).data('type', 'done').html('done');
        jQuery(button).removeClass('wpms_warning').addClass('wpms_ok');
        follow = 1;
    }

    jQuery.ajax({
        url: ajaxurl,
        method: 'POST',
        dataType: 'json',
        data: {
            'action': 'wpms',
            'task': 'update_follow',
            'link_id': link_id,
            'follow': follow,
            'wpms_nonce': wpms_localize.wpms_nonce
        }
    });
}

/**
 * Scan link to save to database
 * @param $this
 */
function wpmsScanLink($this) {
    $this.addClass('scaning');
    jQuery.ajax({
        url: ajaxurl,
        method: 'POST',
        dataType: 'json',
        data: {
            'action': 'wpms',
            'task': 'scan_link',
            'paged': $this.data('paged'),
            'comment_paged': $this.data('comment_paged'),
            'wpms_nonce': wpms_localize.wpms_nonce
        },
        success: function (res) {
            if (!res.status) {
                if (res.type === 'limit') {
                    var wpms_process = jQuery('.wpms_process').data('w');
                    var wpms_process_new = parseFloat(wpms_process) + parseFloat(res.percent);
                    if (wpms_process_new > 100)
                        wpms_process_new = 100;
                    jQuery('.wpms_process').data('w', wpms_process_new).html('<span>' + parseInt(wpms_process_new) + '%</span>').css('width', wpms_process_new + '%').show();
                    $this.trigger('click');
                } else if (res.type === 'limit_comment_content') {
                    wpms_process = jQuery('.wpms_process').data('w');
                    if (wpms_process < 33.33)
                        wpms_process = 33.33;
                    wpms_process_new = parseFloat(wpms_process) + parseFloat(res.percent);
                    if (wpms_process_new > 100)
                        wpms_process_new = 100;
                    jQuery('.wpms_process').data('w', wpms_process_new).html('<span>' + parseInt(wpms_process_new) + '%</span>').css('width', wpms_process_new + '%').show();
                    $this.data('comment_paged', parseInt(res.paged) + 1);
                    $this.trigger('click');
                } else {
                    wpms_process = jQuery('.wpms_process').data('w');
                    if (wpms_process < 66.66)
                        wpms_process = 66.66;
                    wpms_process_new = parseFloat(wpms_process) + parseFloat(res.percent);
                    if (wpms_process_new > 100)
                        wpms_process_new = 100;
                    jQuery('.wpms_process').data('w', wpms_process_new).html('<span>' + parseInt(wpms_process_new) + '%</span>').css('width', wpms_process_new + '%').show();
                    $this.data('paged', parseInt(res.paged) + 1);
                    $this.trigger('click');
                }
            } else {
                $this.removeClass('scaning');
                jQuery('.wpms_process').data('w', 100).html('<span>100%</span>').css('width', '100%');
                jQuery('#wp-seo-meta-form .spinner').hide();
                window.location.assign(document.URL);
            }
        }
    });
}

/**
 * Update follow for link
 * @param button
 */
function wpmsLinkDoAction(button) {
    var $this = jQuery(button);
    var apply = jQuery('.link-apply-action:checked').val();
    var type_follow = jQuery('.link-bulk-action:checked').val();
    if (typeof type_follow === "undefined" || typeof apply === "undefined") {
        return;
    }

    var action_name = type_follow + '_' + apply;
    if (action_name === 'follow_selected' || action_name === 'nofollow_selected' || action_name === 'copy_title_selected') {
        if (parseInt(action_name) === 0)
            return;

        var link_selected = [];
        jQuery(".metaseo_link").each(function () {
            if (jQuery(this).is(':checked')) {
                link_selected.push(jQuery(this).val());
            }
        });
        if (link_selected.length === 0)
            return;
        var data = {
            action: 'wpms',
            task: 'update_multiplefollow',
            linkids: link_selected,
            action_name: action_name,
            wpms_nonce: wpms_localize.wpms_nonce
        };
    } else {
        data = {
            action: 'wpms',
            task: 'update_multiplefollow',
            action_name: action_name,
            wpms_nonce: wpms_localize.wpms_nonce
        };
    }

    jQuery('.spinner_apply_follow').css('visibility', 'visible').show();
    jQuery.ajax({
        url: ajaxurl,
        method: 'POST',
        dataType: 'json',
        data: data,
        success: function (response) {
            if (response.status) {
                jQuery('.spinner_apply_follow').hide();
                window.location.assign(document.URL);
            } else {
                if (action_name === 'follow_all' || action_name === 'nofollow_all' || action_name === 'copy_title_all') {
                    if (response.message === 'limit') {
                        $this.trigger('click');
                    }
                }
            }
        }
    });
}

/**
 * Update length number of meta description for post, page, custom post type
 * @param metadesc_id string id of element tag
 */
function metaseo_desclength(metadesc_id) {
    var desc = (metaseo_clean(jQuery('#' + metadesc_id).val())).trim();
    var postid = metadesc_id.replace('metaseo-metadesc-', '');
    var counter_id = 'metaseo-metadesc-len' + postid;
    jQuery('#' + counter_id).text(desc_max_len - desc.length);
    if (desc.length >= desc_max_len) {
        jQuery('#' + counter_id).removeClass('word-74B6FC').addClass('word-exceed');//#FEFB04
    } else if (desc.length <= 120) {
        jQuery('#' + counter_id).removeClass('word-exceed').addClass('word-74B6FC');//#74B6FC
    } else {
        jQuery('#' + counter_id).removeClass('word-exceed word-74B6FC');
    }

    jQuery('#snippet_desc' + postid).text(desc.substr(0, desc_max_len));
}


/**
 * Update meta description for post, page, custom post type
 * @param metadesc_id
 * @param needToSave
 */
function metaseo_updateDesc(metadesc_id, needToSave) {
    var desc = (metaseo_clean(jQuery('#' + metadesc_id).val())).trim();
    var postid = metadesc_id.replace('metaseo-metadesc-', '');
    if (needToSave === true && oldDescValues[postid] !== desc) {
        saveMetaContentChanges('metadesc', postid, desc);
    }

    //Push the new value into the array
    oldDescValues[postid] = desc;
}

var autosaveNotification;

/**
 * Update content meta
 * @param metakey
 * @param postid
 * @param data
 */
function saveMetaContentChanges(metakey, postid, data) {
    jQuery('.wpms_loader' + postid).show();
    var postData = {
        'action': 'wpms',
        'task': 'updateContentMeta',
        'metakey': metakey,
        'postid': postid,
        'value': data,
        'wpms_nonce': wpms_localize.wpms_nonce
    };
    // We can also pass the url value separately from ajaxurl for front end AJAX implementations
    jQuery.post(wpms_localize.ajax_url, postData, function (response) {
        jQuery('.wpms_loader' + postid).hide();
        result = JSON.parse(response);

        if (result.updated) {
            autosaveNotification = setTimeout(function () {
                jQuery('#savedInfo' + postid).text(result.msg);
                jQuery('#savedInfo' + postid).css('visibility', 'visible');
                setTimeout(function () {
                    jQuery('#savedInfo' + postid).css('visibility', 'hidden');
                }, 1000);
            }, 1000);
        } else {
            alert(result.msg);
        }

    });
}

function checkspecial(element_id) {
    var element = jQuery(element_id);
    var meta_type = element.data('meta-type');

    if (meta_type === 'change_image_name') {
        var str = (element.val());
        return /^[\w\d\-\s+_.$]*$/.test(str) != false;
    } else {
        return true;
    }
}

function metaseo_update(element_id) {
    var element = jQuery(element_id);
    element.data('post-id');
    element.data('meta-type');
    element.val();
}

/**
 * Update meta
 * @param element_id string element id
 * @param post_id int post id
 * @param meta_type string meta type name
 * @param meta_value string meta value
 * @returns {boolean}
 */
function saveChanges(element_id, post_id, meta_type, meta_value) {

    var element = jQuery(element_id);
    var savedInfo = element.parent().find('span.saved-info');
    if (savedInfo.length < 1) {
        savedInfo = element.closest('td').find('span.saved-info');
    }

    var updated = false;
    var postData = {
        'action': 'wpms',
        'task': 'updateMeta',
        'post_id': post_id,
        'meta_type': meta_type,
        'meta_value': meta_value,
        'img_name': element.closest('tr').find('.fix-metas').data('img-name'),
        'opt_key': element.closest('tr').find('.fix-metas').data('opt-key'),
        'addition': {
            'meta_key': element.data('meta-key'),
            'meta_type': element.data('meta-type'),
            'meta_value': element.val(),
            'meta_order': element.data('meta-order'),
            'img_post_id': element.data('img-post-id'),
            'post_id': element.data('post-id')
        },
        'wpms_nonce': wpms_localize.wpms_nonce
    };

    // We can also pass the url value separately from ajaxurl for front end AJAX implementations
    jQuery.ajax({
        url: wpms_localize.ajax_url,
        type: 'post',
        data: postData,
        dataType: 'json',
        beforeSend: function () {
            savedInfo.empty().append('<span class="spinner"></span>');
            if (element.hasClass('metaseo-fix-meta')) {
                element.closest('.metaseo-img-wrapper').find('.spinner').css('visibility', 'visible').show();
            } else {
                element.parent().find('.spinner').css('visibility', 'visible').show();
            }
        },
        success: function (response) {
            if (parseInt(response) === 0) {
                saveChanges(element_id, post_id, meta_type, meta_value);
            }

            updated = response.updated;

            if (updated) {
                autosaveNotification = setTimeout(function () {

                    if (element.hasClass('metaseo-fix-meta')) {
                        element.closest('.metaseo-img-wrapper').find('.spinner').hide();
                    } else {
                        element.parent().find('.spinner').hide();
                    }

                    savedInfo.removeClass('metaseo-msg-warning').addClass('metaseo-msg-success')
                        .text(response.msg).fadeIn(200);
                    setTimeout(function () {
                        savedInfo.empty().append('<span class="spinner"></span>');
                        savedInfo.hide();
                    }, 3000);

                }, 200);

                //update image's data-name attribute
                if (typeof element.data('extension') !== 'undefined') {
                    jQuery('[data-img-post-id="' + element.data('post-id') + '"]').data('name', element.val() + element.data('extension'));
                }
                //Scan post and update post_meta
                var img = jQuery('[data-img-post-id="' + postData['addition']['img_post_id'] + '"]');
                if (img.length > 0) {
                    _metaSeoScanImages(
                        {
                            'name': img.data('name'),
                            'img_post_id': postData['addition']['img_post_id'],
                            'type': 'update_meta'
                        }
                    );
                }

                if (typeof response.type !== "undefined" && response.type === 'auto_override') {
                    _metaSeoScanImages(
                        {
                            'name': response.imgname,
                            'img_post_id': response.pid,
                            'type': 'update_meta'
                        }
                    );
                }

                if (typeof response.type_change !== "undefined" && response.type_change === 'edit_meta_alt') {
                    jQuery('#img-alt-' + element.data('img-post-id')).val(element.val());
                }
            } else {
                element.val(response.iname);
                savedInfo.removeClass('metaseo-msg-success').addClass('metaseo-msg-warning')
                    .text(response.msg).fadeIn(200).delay(2000).fadeOut(200);
            }
        },
        error: function () {

        }
    });

    return updated;
}

/**
 * Scan all posts to find a group of images in their content
 */
function metaSeoScanImages() {
    var imgs = [];
    jQuery('.metaseo-image').each(function (i) {
        if (jQuery(this).data('name') !== '') {
            imgs[i] = {
                'name': jQuery(this).data('name'),
                'img_post_id': jQuery(this).data('img-post-id')
            };
        }
    });

    jQuery.each(imgs, function (i, v) {
        _metaSeoScanImages(v);
    });

}

/**
 * Scan images good and not good in post content
 * @param imgs array current image info
 * @returns {boolean}
 * @private
 */
function _metaSeoScanImages(imgs) {
    if (imgs.length < 1) {
        //alert('No images choosen for scanning, please check again!');
        return false;
    }

    jQuery.ajax({
        url: wpms_localize.ajax_url,
        method: 'post',
        data: {
            'action': 'wpms',
            'task': 'scanPosts',
            'imgs': imgs,
            'wpms_nonce': wpms_localize.wpms_nonce
        },
        dataType: 'json',
        beforeSend: function () {
        },
        success: function (response) {
            if (parseInt(response) === 0) {
                _metaSeoScanImages(imgs);
            }
            //clog(imgs);
            if (response.success === true) {
                //Clear content holder first
                if (imgs.length === 1) {
                    jQuery('#opt-info-' + imgs[0]['img_post_id']).removeClass('opt-info-warning').empty();
                }
                //id is refered to image post id
                for (var iID in response.msg) {
                    jQuery('#opt-info-' + iID).html(null);
                    //Change css position property of td tag to default
                    jQuery('#opt-info-' + iID).parent().css('position', 'static');
                    jQuery('#opt-info-' + iID).append('<p class="btn-wrapper"></p>');

                    for (var msgType in response.msg[iID]) {
                        if (response.msg[iID][msgType]['warning']
                            && !jQuery('#opt-info-' + iID).hasClass('opt-info-warning')) {
                            jQuery('#opt-info-' + iID).addClass('opt-info-warning');
                        }

                        jQuery('#opt-info-' + iID).find('p.btn-wrapper').append(response.msg[iID][msgType]['button']);
                        if (typeof response.msg[iID][msgType]['msg'] !== 'object') {
                            var hlight = !response.msg[iID][msgType]['warning'] ? 'metaseo-msg-success' : '';
                            jQuery('#opt-info-' + iID).prepend('<p class="' + hlight + '">' + response.msg[iID][msgType]['msg'] + '</p>');
                        } else {
                            for (var k in response.msg[iID][msgType]['msg']) {
                                jQuery('#opt-info-' + iID).prepend('<p>' + response.msg[iID][msgType]['msg'][k] + '</p>');
                            }
                        }

                    }

                    jQuery('#opt-info-' + iID).parent().find('span.metaseo-loading').hide();
                }

                jQuery('.opt-info-warning').fadeIn(200);
                jQuery('input.metaseo-checkin').each(function (i, input) {
                    uncheck(input);
                });
            }

            // show tooltip when hover 'Fix meta/Edit meta' button
            tippy('.fix-metas', {
                animation: 'scale',
                duration: 0,
                arrow: false,
                placement: 'top',
                theme: 'wpms-widgets-tippy_show_arow',
                onShow(instance) {
                    instance.popper.hidden = instance.reference.dataset.tippy ? false : true;
                    instance.setContent(instance.reference.dataset.tippy);
                }
            });
        },
        error: function () {
            // alert('Errors occured while scanning posts for optimization');
        }
    });
}

/**
 * To fix meta of a specified image
 * @param that
 */
function metaseo_fix_meta(that) {
    var $this = jQuery(that);

    if (checkspecial(that) === true) {

        if (that.jquery === undefined) {
            $this.bind('input propertychange', function () {
                metaseo_update(that);
            });
        } else {
            metaseo_update(that);
        }

    }
}

/**
 * Add meta default
 * @param that
 */
function add_meta_default(that) {
    var $this = jQuery(that);
    var input = $this.parent().find('input');
    input.val($this.data('default-value')).focus();
}

//--------------------------------
/**
 * Optimize a single post
 * @param element string current element
 * @returns {boolean}
 */
function optimize_imgs(element) {
    var $this = jQuery(element);
    var post_id = $this.data('post-id');
    var img_post_id = $this.data('img-post-id');
    var checkin = jQuery('.checkin-' + post_id);
    var img_exclude = [];
    var not_checked_counter = 0;
    var updated = false;

    var j = 0;
    checkin.each(function (i, el) {
        if (!(jQuery(el).is(':checked'))) {
            not_checked_counter++;
            if (jQuery(el).val() !== '' || jQuery(el).val() !== 'undefined') {
                img_exclude[j] = parseInt(jQuery(el).val());
                j++;
            }
        }
    });

    if (checkin.length <= not_checked_counter) {
        //alert('No images has choosen. \\nPlease click on the checkbox in what image you want to replace!');
        return false;
    }

    if (!post_id && !img_post_id) {
        alert('Cant do the optimization because of missing image ID.\\nPlease check again!');
    } else {
        jQuery.ajax({
            url: wpms_localize.ajax_url,
            async: false,
            data: {
                'action': 'wpms',
                'task': 'optimize_imgs',
                'post_id': post_id,
                'img_post_id': img_post_id,
                'img_exclude': img_exclude,
                'wpms_nonce': wpms_localize.wpms_nonce
            },
            dataType: 'json',
            type: 'post',
            beforeSend: function () {
                $this.parent().find('span.spinner').css('visibility', 'visible').show();
            },
            success: function (response) {
                if (parseInt(response) === 0) {
                    optimize_imgs(element);
                }

                if (response.success) {
                    updated = true;

                    checkin.each(function () {
                        if (jQuery.inArray(parseInt(jQuery(this).val()), img_exclude) === -1) {

                            var img_choosen = jQuery(this).parent();
                            jQuery(this).remove();

                            img_choosen.empty().append('<span class="metaseo-checked"></span>');
                            img_choosen.parent().find('p.metaseo-msg').removeClass('msg-error').addClass('msg-success').empty().text(response.msg).fadeIn(200);
                            setTimeout(function () {
                                img_choosen.find('p.metaseo-msg').fadeOut(300);
                            }, 5000);

                        }
                    });

                    var checked = jQuery('.checkin-' + post_id);
                    if (checked.length === 0) {
                        $this.addClass('disabled replaced').removeClass('ju-button waves-effect waves-light').html(wpms_localize.replaced);
                    }

                    $this.parent().find('span.spinner').fadeOut(300);
                    //Disable Replace all button if all image were resized
                    var metaseo_checkin = jQuery('.metaseo-checkin');

                    if (metaseo_checkin.length === 0) {
                        jQuery('#metaseo-replace-all').addClass('disabled');
                    }
                    //Scan post and update post_meta
                    var img = jQuery('[data-img-post-id="' + img_post_id + '"]');
                    _metaSeoScanImages({'name': img.data('name'), 'img_post_id': img_post_id});

                    setTimeout(function () {
                        window.location.reload(true);
                    }, 1000);
                } else {
                    $this.parent().find('span.spinner').hide();
                    $this.parent().find('p.metaseo-msg').removeClass('msg-success').addClass('msg-error');
                }

            },
            error: function () {

            }
        });
    }

    img_exclude = [];
    return updated;
}

/**
 * Optimize all posts in list displayed
 * @param that
 */
function optimize_imgs_group(that) {
    jQuery('a.metaseo-optimize').each(function (i, el) {
        if (parseInt(i) === 0) {
            jQuery(that).parent().find('span.spinner').show();
        }

        jQuery(this).trigger('click');

        if (parseInt(i) === (jQuery(el).length - 1)) {
            jQuery(that).parent().find('span.spinner').hide();
        }
    });

}

/**
 * disable Replace images
 * @param that
 */
function uncheck(that) {
    var post_id = that.get(0).className.substr(that.get(0).className.lastIndexOf('-') + 1);
    var checked = jQuery('.checkin-' + post_id);
    var not_checked_counter = 0;

    checked.each(function () {
        if (!(jQuery(this).is(':checked'))) {
            not_checked_counter++;
        }
    });

    //Toggle disable Replace button if all images in a post were resized
    if (not_checked_counter >= checked.length) {
        jQuery('a.metaseo-optimize[data-post-id="' + post_id + '"]').addClass('disabled');
    } else {
        jQuery('a.metaseo-optimize[data-post-id="' + post_id + '"]').removeClass('disabled');
    }

    //Toggle disable Replace all button if all images in posts were resized
    var replaceBtns = jQuery('.metaseo-optimize');
    var disable = true;
    replaceBtns.each(function (i, btn) {
        if (!jQuery(btn).hasClass('disabled')) {
            disable = false;
        }
    });

    if (disable === true) {
        jQuery('#metaseo-replace-all').addClass('disabled');
    } else {
        jQuery('#metaseo-replace-all').removeClass('disabled');
    }
}

/**
 * Show posts list for resizing or update meta info of an image with specified id
 * @param element
 */
function showPostsList(element) {
    var that = jQuery(element);
    var data = {
        'action': 'wpms',
        'task': 'load_posts',
        'img_name': that.data('img-name'),
        'post_id': that.data('post-id'),
        'opt_key': that.data('opt-key'),
        'wpms_nonce': wpms_localize.wpms_nonce
    };

    if (that.data('img-name') !== '') {
        jQuery.ajax({
            url: wpms_localize.ajax_url,
            type: 'post',
            dataType: 'html',
            data: data,
            beforeSend: function () {
                that.find('.spinner-light').show();
            },
            success: function (response) {
                if (parseInt(response) === 0) {
                    showPostsList(element);
                }
                that.parent().find('.spinner-light').hide();
                that.closest('td.col_image_info').find('div.popup > .popup-content').empty().html(response).fadeIn(300);

                jQuery('.metaseo-img img').on('click', function () {
                    if (jQuery(this).closest('.metaseo-img-wrapper').hasClass('checked')) {
                        jQuery(this).closest('.metaseo-img-wrapper').removeClass('checked');
                        jQuery(this).closest('.metaseo-img-wrapper').find('.metaseo-checkin').prop('checked', false);
                        uncheck(jQuery(this).closest('.metaseo-img-wrapper').find('.metaseo-checkin'));
                    } else {
                        jQuery(this).closest('.metaseo-img-wrapper').addClass('checked');
                        jQuery(this).closest('.metaseo-img-wrapper').find('.metaseo-checkin').prop('checked', true);
                    }
                });

                //to set background-color of popup-header to like adminmenu active 
                var metaseo_bg = jQuery('#adminmenu li.wp-has-current-submenu a.wp-has-current-submenu').css('background-color');

                if (metaseo_bg !== 'undified') {
                    jQuery('.popup-content .content-header').css({'background-color': metaseo_bg, 'color': '#FFF'});
                    jQuery('span.popup-close').css({'color': '#FFF'});
                }

                that.showPopup(that);
            }
        });
    } else {
        alert('Something went wrong, please check Image name if it\'s empty before click Resize button');
    }
}

/**
 * Import meta data from other plugin into Wp Meta Seo
 * @param that
 * @param event
 */
function importMetaData(that, event) {
    var element = jQuery('#' + that.id);

    event.preventDefault();
    if (that.id === '_aio_' || that.id === '_yoast_') {
        jQuery.ajax({
            url: wpms_localize.ajax_url,
            type: 'post',
            data: {
                'action': 'wpms',
                'task': 'import_meta_data',
                'plugin': that.id,
                'wpms_nonce': wpms_localize.wpms_nonce
            },
            dataType: 'json',
            beforeSend: function () {
                element.find('span.spinner-light').show();
            },
            success: function (response) {
                if (response.success) {
                    element.find('span.spinner-light').fadeOut(500);
                    jQuery('.metaseo-import-wrn').closest('.error').fadeOut(1500);
                    //Refresh the page to see al changed after import Yoast or AIO data into MetaSEO
                    if (location.href.search('page=metaseo_content_meta') !== -1) {
                        location.reload();
                    }
                }
            },
            error: function () {
                alert('Something went wrong in import processing!');
            }

        });
    }
}

/**
 * Update once input changed and blur
 * @param that
 */
function updateInputBlur(that) {
    var element = jQuery(that);
    var post_id = element.data('post-id');
    var meta_type = element.data('meta-type');
    var meta_value = element.val();
    if (saveChanges(that, post_id, meta_type, meta_value)) {
        if (meta_type === 'change_image_name') {
            jQuery('a.img-resize[data-post-id="' + post_id + '"]').data('img-name', meta_value);
        }
    }
}

/**
 * Check keypress Code
 * @param event
 * @returns {boolean}
 */
function checkeyCode(event) {
    if (parseInt(event.which) === 13 || parseInt(event.keyCode) === 13) {
        return false;
    }
}

/**
 * Check if a image name is valid or not
 * @param iname string name of image
 * @returns {*}
 */
function validateiName(iname) {
    var is_only_spaces = iname.length > 0;
    iname = iname.trim();
    var msg = '';

    if (iname.length < 1) {
        msg = !is_only_spaces ? 'Should not be empty' : 'Should not only spaces';
        return {msg: msg, name: ''};
    }

    return {msg: '', name: iname};
}

/**
 * Scan meta image
 * @param $this
 */
function wpms_image_scan_meta($this) {
    $this.addClass('scaning');
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: {
            action: "wpms",
            task: "image_scan_meta",
            paged: $this.data('paged'),
            wpms_nonce: wpms_localize.wpms_nonce
        },
        success: function (res) {
            var w = jQuery('.wpms_process_meta').data('w');


            if (res.status === 'error_time') {
                if (typeof res.percent !== "undefined") {
                    var wpms_process = jQuery('.wpms_process').data('w');
                    var wpms_process_new = parseFloat(wpms_process) + parseFloat(res.percent);
                    if (wpms_process_new > 100)
                        wpms_process_new = 100;
                    $this.data('paged', parseInt(res.paged) + 1);
                    jQuery('.wpms_process').data('w', wpms_process_new).html('<span>' + parseInt(wpms_process_new) + '%</span>').css('width', wpms_process_new + '%').show();
                    jQuery('.image_scan_meta').trigger('click');
                }
            } else {
                $this.removeClass('scaning');
                jQuery('.wpms_process').data('w', 100).html('<span>100%</span>').css('width', '100%');
                jQuery('#wp-seo-meta-form .spinner').hide();
                window.location.assign(document.URL);
            }
        }
    });
}

jQuery(document).ready(function ($) {
    $('.mbulk_copy').on('click', function () {
        $('.mbulk_copy').prop('checked', false);
        $(this).prop('checked', true);
    });

    $('.bulk-action-follow').on('click', function () {
        $('.bulk-action-follow').prop('checked', false);
        $(this).prop('checked', true);
    });

    $('[name="post_type_filter"], .wpms_duplicate_meta, .wpms_lang_list, .wpms_post_visibility').on('change', function () {
        $('#wp-seo-meta-form').submit()
    });
    $('[name="taxonomy_filter"], .wpms_duplicate_cat_meta').on('change', function () {
        $('#wp-seo-meta-form').submit()
    });

    $('#home_text_default').on('change', function () {
        if ($(this).is(':checked')) {
            $('.tr_home_text').addClass('show').removeClass('hide');
        } else {
            $('.tr_home_text').addClass('hide').removeClass('show');
        }
    });

    $('.image_scan_meta').on('click', function () {
        wpms_image_scan_meta($(this));
    });

    $('.wp-meta-seo_page_metaseo_image_meta #image-submit').on('click', function (e) {
        e.preventDefault();
        $('.imgspinner').show().css('visibility', 'visible');
        $('#wp-seo-meta-form').submit();
    });

    //Cursor changes on any ajax start and end
    //Thanks to iambriansreed from stacoverflow.com
    $(document).ajaxStart(function () {
        $('body').css({'cursor': 'wait'});
    }).ajaxStop(function () {
        $('body').css({'cursor': 'default'});
    });

    $('span.pagination-links a.disabled').on('click', function (e) {
        e.preventDefault();
    });

    // when change value of per page input in image view
    $('.metaseo_imgs_per_page').on('input propertychange', function () {
        var perpage = $(this).val();
        $('.metaseo_imgs_per_page').each(function (i, e) {
            if ($(e).val() !== perpage) {
                $(e).val(perpage);
            }
        });
    });

    // when change link source filter in link view
    $('.metaseo_link_source').on('change', function () {
        var value = $(this).val();
        $('.metaseo_link_source').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    // when change follow value of link in link view
    $('.metaseo_follow_action').on('change', function () {
        var value = $(this).val();
        $('.metaseo_follow_action').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    // when change the filter
    $('.metaseo-filter').on('change', function () {
        var value = $(this).val();
        $('.metaseo-filter').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    // when change 'All images' filter in image view
    $('.meta_filter').on('change', function () {
        var value = $(this).val();
        $('.meta_filter').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    // when change 'Status' filter in 404 view
    $('.redirect_filter').on('change', function () {
        var value = $(this).val();
        $('.redirect_filter').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    // when change broken filter in 404 view
    $('.broken_filter').on('change', function () {
        var value = $(this).val();
        $('.broken_filter').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    // when change 'All meta infomation' filter in content view
    $('.wpms_duplicate_meta').on('change', function () {
        var value = $(this).val();
        $('.wpms_duplicate_meta').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    $('.wpms_post_visibility').on('change', function () {
        var value = $(this).val();
        $('.wpms_post_visibility').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    $('.wpms_lang_list').on('change', function () {
        var value = $(this).val();
        $('.wpms_lang_list').each(function (i, e) {
            if ($(e).val() !== value) {
                $(e).val(value);
            }
        });
    });

    $('.metaseo-img-name').on('input propertychange', function () {
        var savedInfo = $(this).parent().find('span.saved-info');
        var iname = validateiName($(this).val());
        var msg = iname.msg;
        if (iname.name.length > 0) {
            if (!checkspecial(this)) {
                msg = 'Should not special char';
            }
        }

        if (msg.length > 0) {
            //Set this value to metaseoValueHolder
            metaseoValueHolder[this.id] = iname.name.substr(0, iname.name.length - 1);

            savedInfo.removeClass('metaseo-msg-success')
                .addClass('metaseo-msg-warning').empty().text(msg);
        }
    });

    $('.metaseo-img-meta').each(function (i, element) {
        if ($(this).hasClass('metaseo-img-name')) {
            metaseoValueHolder[this.id + '_prev'] = jQuery(this).val();
        }
        $(element).on('keydown', function (event) {
            if (parseInt(event.which) === 13 || parseInt(event.keyCode) === 13) {
                return false;
            }
        });
    });

    $('.metaseo-img-meta').on('change', function () {
        if (jQuery(this).val() === '') {
            jQuery(this).val(metaseoValueHolder[this.id + '_prev']);
            $(this).parent().find('span.saved-info').empty().append('<span class="spinner"></span>');
        }
        if (checkspecial(this) === true) {
            updateInputBlur(this);
        }
    });

    // when import meta
    $('.dissmiss-import').on('click', function (e) {
        e.preventDefault();
        $(this).closest('.error').fadeOut(1000);
        setTimeout(function () {
            $(this).closest('.error').remove();
        }, 5000);

        var plugin = $(this).parent().find('a.button').attr('id');

        if (plugin === '_aio_' || plugin === '_yoast_') {
            $.ajax({
                url: wpms_localize.ajax_url,
                type: 'post',
                data: {
                    'action': 'wpms',
                    'task': 'dismiss_import_meta',
                    'plugin': plugin,
                    'wpms_nonce': wpms_localize.wpms_nonce
                },
                dataType: 'json',
                beforeSend: function () {

                },
                success: function (response) {
                    if (response.success !== true) {
                        alert('Dismiss failed!');
                    }
                }
            });
        }
    });

    // when change follow of post/page in metabox view
    $('.metaseo_metabox_follow').on('change', function () {
        var page_id = $(this).data('post_id');
        var follow = $(this).val();
        metaseo_update_pagefollow(page_id, follow);
    });

    // when change index of post/page in metabox view
    $('.metaseo_metabox_index').on('change', function () {
        var page_id = $(this).data('post_id');
        var index = $(this).val();
        metaseo_update_pageindex(page_id, index);
    });
    //----------------------------------------------------------
    //Pop-up declaration
    $.fn.absoluteCenter = function () {
        this.each(function () {
            $(this).css({
                'position': 'fixed',
                'top': $('div.wrap').offset().top,
                'left': $('div.wrap').offset().left,
                'right': '25px',
                'bottom': '10px'
            });
            return this;
        });
    };

    $.fn.showPopup = function (that) {
        var bg = $('div.popup-bg');
        var obj = that.closest('.col_image_info').find('div.popup');
        var btnClose = obj.find('.popup-close');
        bg.animate({opacity: 0.2}, 0).fadeIn(200);
        obj.fadeIn(200).absoluteCenter();
        btnClose.on('click', function () {
            bg.fadeOut(100);
            obj.fadeOut(100).find('div.popup-content').empty();
        });
        bg.on('click', function () {
            btnClose.trigger('click');
        });
        $(document).keydown(function (e) {
            if (parseInt(e.keyCode) === 27) {
                btnClose.trigger('click');
            }
        });
        return false;
    };
    $('a.show-popup').on('click', function () {
        $(this).showPopup($(this));
    });


    $(".wpms-blocks-active").attr('disabled', 'disabled');

    $('.custom-bulk-metaseo-metadesc, .custom-bulk-metaseo-metatitle, .wpms-category-title-input, .wpms-category-desc-textarea').on('mouseover', function () {
        $(this).addClass('wpms-mouseover-frame');
    }).on('mouseout', function () {
        $(this).removeClass('wpms-mouseover-frame');
    });
});

function changeSettingProfile(profileId, profileList) {
    let selectedProfile;
    for (let i = 0; i < profileList.length; i++) {
        if (profileList[i][1] === profileId) {
            selectedProfile = profileList[i];
            break;
        }
    }
    // Select element
    let anonymizeIpElement = document.getElementById('anonymize-ip-tracking');
    let trackingTypeElement = document.getElementById('gg-tracking-type');
    let profileElement = document.getElementById('tracking-profile-info');
    if (profileId == 0 && profileElement != null) {
        profileElement.innerHTML = '';
    }
    if (profileId != 0 && selectedProfile !== 'undefined') {
        // Setting basic tracking
        if (typeof selectedProfile !== 'undefined' && selectedProfile[4] === 'GA4') {
            anonymizeIpElement.style.display = 'none';
            trackingTypeElement.style.display = 'none';
        } else {
            anonymizeIpElement.style.display = 'block';
            trackingTypeElement.style.display = 'block';
        }

        // Display select profile info
        let profileInfoHtml = '';
        if (typeof selectedProfile[0] !== 'undefined' && selectedProfile[0]) profileInfoHtml += 'Profile Name: ' + selectedProfile[0] + '<br>';
        if (typeof selectedProfile[1] !== 'undefined' && selectedProfile[1]) profileInfoHtml += 'Profile ID: ' + selectedProfile[1] + '<br>';
        if (typeof selectedProfile[2] !== 'undefined' && selectedProfile[2]) profileInfoHtml += 'Property ID: ' + selectedProfile[2] + '<br>';
        if (typeof selectedProfile[3] !== 'undefined' && selectedProfile[3]) profileInfoHtml += 'Default URL: ' + selectedProfile[3] + '<br>';
        if (typeof selectedProfile[4] !== 'undefined' && selectedProfile[4]) profileInfoHtml += 'Property Type: ' + selectedProfile[4] + '<br>';
        if (typeof selectedProfile[5] !== 'undefined' && selectedProfile[5]) profileInfoHtml += 'Time Shift: ' + selectedProfile[5] + '<br>';
        if (typeof selectedProfile[6] !== 'undefined' && selectedProfile[6]) profileInfoHtml += 'Time Zone: ' + selectedProfile[6] + '<br>';
        if (typeof selectedProfile[7] !== 'undefined' && selectedProfile[7]) profileInfoHtml += 'Default Page: ' + selectedProfile[7] + '<br>';
        if (typeof selectedProfile[8] !== 'undefined' && selectedProfile[8]) profileInfoHtml += 'Measurement ID: ' + selectedProfile[8];

        if (profileElement != null) {
            profileElement.innerHTML = profileInfoHtml;
        }
    }


}

function requireTrackingIdTitle(propertyType) {
    if (propertyType !== 'undefined') {
        if (propertyType === 'analytics4') {
            jQuery('#wpms-trackingId-title > label').text(wpms_localize.gg_disconnect_title.ga4);
        } else if(propertyType === 'tagmanager') {
            jQuery('#wpms-trackingId-title > label').text(wpms_localize.gg_disconnect_title.tagmanager);
        } else {
            jQuery('#wpms-trackingId-title > label').text(wpms_localize.gg_disconnect_title.universal);
        }
    }
}

function reloadSelectContainer(data) {
    let selectElement = document.getElementById('wpms-displaySelectContainers');
    let html = '<option value="0">Select a container</option>';
    for (let i = 0; i < data.length; i++) {
        html += '<optgroup label="containers/' + data[i]['containerId'] + '">' +
            '<option value="' + data[i]['containerId'] + '">' + data[i]['name'] + '</option>' +
            '</optgroup>'
    }
    if (selectElement) {
        selectElement.innerHTML = html;
    }
}

function tagmanagerDisplayAccountInfo(accountList, selectedID) {
    let accountInfo = document.getElementById('wpms-tagmanager-account-info');
    if (typeof accountList !== 'undefined' && typeof selectedID !== 'undefined') {
        let html = '';
        let i = 0
        for (; i < accountList.length; i++) {
            if (accountList[i]['accountId'] === selectedID) {
                break;
            }
        }
        if (accountList[i]['accountId']) html += 'Account ID: ' + accountList[i]['accountId'] + '<br>';
        if (accountList[i]['name']) html += 'Account Name: ' + accountList[i]['name'] + '<br>';

        if (accountInfo) {
            accountInfo.innerHTML = html;
        }
    }
}

function getSelectedTagManagerAccount(accountList, selectedID) {
    let titleInfo = document.getElementById('wpms-tagmanager-title-info');
    let accountDiv = document.getElementById('wpms-tagmanager-account-div');
    let wpmstmInformationDiv = document.getElementById('wpmstm-information');

    if (typeof selectedID !== 'undefined' && typeof accountList !== 'undefined') {
        if (0 === parseInt(selectedID)) {
            titleInfo.style.display = 'none';
            accountDiv.style.display = 'none';
            wpmstmInformationDiv.style.display = 'none';
            document.getElementById('wpms-displaySelectContainers').innerHTML = '<option value="0">Select a container</option>';
            document.getElementById('wpms-tagmanager-container-div').style.display = 'none';
        }

        // Call Tag Manager API to get containers
        if (0 < parseInt(selectedID)) {
            titleInfo.style.display = 'block';
            wpmstmInformationDiv.style.display = 'block';
            accountDiv.style.display = 'block';
            tagmanagerDisplayAccountInfo(accountList, selectedID);
            jQuery.ajax({
                url: wpms_localize.ajax_url,
                type: 'post',
                data: {
                    'accountID': selectedID,
                    'action': 'wpms',
                    'task': 'wpms_tagmanager_request_containers',
                    'wpms_nonce': wpms_localize.wpms_nonce
                },
                dataType: 'json',
                beforeSend: function () {
                    jQuery('.load-containers-spinner').css('visibility', 'visible');
                },
                success: function (response) {
                    reloadSelectContainer(response);
                    jQuery('.load-containers-spinner').css('visibility', 'hidden');
                }
            });
        }
    }
}

function tagmanagerDisplayContainerInfo(container) {
    // Selected element
    let containerInfo = document.getElementById('wpms-tagmanager-container-info');

    if (typeof container !== 'undefined' && container) {
        let html = '';

        if (container['containerId']) html += 'Container ID: ' + container['containerId'] + '<br>';
        if (container['name']) html += 'Container Name: ' + container['name'] + '<br>';
        if (container['path']) html += 'Container Path: ' + container['path'] + '<br>';
        if (container['publicId']) html += 'Public ID: ' + container['publicId'] + '<br>';
        if (container['usageContext']) html += 'Usage Context: ' + container['usageContext'][0] + '<br>';
        if (container['notes']) html += 'Notes: ' + container['notes'] + '<br>';
        if (containerInfo) {
            containerInfo.innerHTML = html;
        }
    }
}

function getSelectedTagManagerContainer(selectedID) {
    let containerDiv = document.getElementById('wpms-tagmanager-container-div');
    if (typeof selectedID !== 'undefined' && selectedID > 1) {
        if (containerDiv) {
            containerDiv.style.display = 'block';
        }
        jQuery.ajax({
            url: wpms_localize.ajax_url,
            type: 'post',
            data: {
                'containerID': selectedID,
                'action': 'wpms',
                'task': 'wpms_tagmanager_container_info',
                'wpms_nonce': wpms_localize.wpms_nonce
            },
            dataType: 'json',
            beforeSend: function () {

            },
            success: function (response) {
                tagmanagerDisplayContainerInfo(response);
            }
        });
    } else {
        if (containerDiv) {
            containerDiv.style.display = 'none';
        }
    }
}

function reloadContainerInfo() {
    // Selected element
    let containerDiv = document.getElementById('wpms-tagmanager-container-div');
    if (containerDiv) {
        containerDiv.style.display = 'none';
    }
}

// Javascript display setting account after reload connect with GTM
function tagmanagerDisplayAccountSetting(accList) {
    // Hide old information
    accountList = accList; // global variable
    document.getElementById('wpmstm-information').style.display = 'none';
    document.getElementById('wpms-tagmanager-title-info').style.display = 'none';
    document.getElementById('wpms-displaySelectContainers').innerHTML = '<option value="0">Select a container</option>';

    // Selected element
    const selectedEl = document.getElementById('wpms-tagmanager-account-setting');
    let elementHtml = '<lable class="ju-setting-label wpms_width_100">' + 'Account:' + '</lable>';
    if (typeof accList !== 'undefined' && accList[0] !== null) {
        elementHtml += '<p class="p-d-20">' +
            '<label>' +
            '<input type="hidden" name="wpms_nonce" value="' + wpms_localize.wpms_nonce + '">' +
            '<select id="wpms-tagmanager-accounts" class="wpms-large-input wpms_width_100" ' +
            'onchange="reloadContainerInfo()" onclick="getSelectedTagManagerAccount(accountList, this.value)"' +
            'name="wpms-tagmanager-accounts">' +
            '<option value="0">Select an account</option>';
        accList.forEach(function (account) {
            elementHtml += '<optgroup label="' + account['path'] + '"><option value="' + account['accountId'] + '">' + account['name'] + '</option></optgroup>';
        })
        elementHtml += '</select></label></p>';
        if (selectedEl) {
            selectedEl.innerHTML = elementHtml;
        }
    } else {
        elementHtml += '<p class="wpms_width_50" style="margin: auto;" id="wpms-create-tagmanager-account">' +
            '<a style="border: none; background-color: #00a0d2" class="ju-button orange-button" href="https://tagmanager.google.com/#/admin/accounts/create" target="_blank">' +
            'Create an account</a></p>';
        if (selectedEl) {
            selectedEl.innerHTML = elementHtml;
        }
    }
}

// Refresh connection with google tag manager
function refreshTagmanagerConnect() {
    wpmstm_refresh_process = document.getElementById('wpms-refresh-gtm-process');
    jQuery.ajax({
        url: wpms_localize.ajax_url,
        type: 'post',
        data: {
            'action': 'wpms',
            'task': 'wpms_tagmanager_refresh_connect',
            'wpms_nonce': wpms_localize.wpms_nonce
        },
        dataType: 'json',
        beforeSend: function () {
            jQuery('.refresh-tm-spinner').css('visibility', 'visible');
        },
        success: function (response) {
            if (response) {
                tagmanagerDisplayAccountSetting(response);
                jQuery('.refresh-tm-spinner').css('visibility', 'hidden');
                wpmsSnackbarModule.show({
                    id: 'wpms-refresh-gtm-success',
                    content: "Refresh successfully",
                    auto_close: true,
                    is_progress: true
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            jQuery('.refresh-tm-spinner').css('visibility', 'hidden');
            if (textStatus === 'error' && errorThrown === 'Internal Server Error') {
                jQuery('.wpmstm-error-enable-api').removeClass('hidden');
                setTimeout(function () {
                    jQuery('.wpmstm-error-enable-api').addClass('hidden');
                }, 5000);
            } else {
                jQuery('.wpmstm-error-access-code').removeClass('hidden');
                setTimeout(function () {
                    jQuery('.wpmstm-error-access-code').addClass('hidden');
                }, 5000);
            }
        }
    });
}
(function(){dust.register("system.role.roleForm",body_0);function body_0(chk,ctx){return chk.write("<form  method=\"post\" id=\"roleForm\"   role=\"form\"><input type=\"hidden\" name=\"_csrf\" value=\"").reference(ctx.get(["_csrf"], false),ctx,"h").write("\" /><div class=\"form-group\"><label for=\"roleName\" class=\"control-label\">角色名<span class=\"required-indicator\">*</span></label><input type=\"text\" name=\"role[name]\" class=\"form-control\" id=\"roleName\" value=\"").reference(ctx.getPath(false, ["role","name"]),ctx,"h").write("\" required></div><div class=\"form-group\"><label for=\"roleCode\" class=\"control-label\">角色代码<span class=\"required-indicator\">*</span></label><input type=\"text\"   id=\"roleCode\" name=\"role[code]\" value=\"").reference(ctx.getPath(false, ["role","code"]),ctx,"h").write("\"  class=\"form-control\"  required><p class=\"help-block\">例如：ROLE_ADMIN、ROLE_USER</p></div><div class=\"form-group\"><label for=\"roleValid\" class=\"control-label\">是否有效<span class=\"required-indicator\">*</span></label>").helper("baseCode",ctx,{},{"base":"valid","name":"role[isValid]","id":"roleValid","selectValue":body_1,"required":"true"}).write("</div></form>");}function body_1(chk,ctx){return chk.reference(ctx.getPath(false, ["role","isValid"]),ctx,"h");}return body_0;})();
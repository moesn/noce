import {Component, OnInit} from '@angular/core';

import {NcTokenService, NcAuthResult, NcAuthService} from '../../services';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {DomSanitizer} from '@angular/platform-browser';
import {getAppOption, getAuthOption, NcCryptService} from 'noce/core';

@Component({
  selector: 'nc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class NcLoginComponent implements OnInit {
  title = getAuthOption('title');
  user = {username: '', password: '', vercode: ''}; // 用户登录表单
  submitting = false; // 防止重复提交
  codeimg: any = ''; // 验证码图片
  loginBg: string; // 登录背景图片

  constructor(private sanitizer: DomSanitizer,
              private authService: NcAuthService,
              private crypt: NcCryptService,
              private token: NcTokenService,
              private notify: NzNotificationService) {
    this.loginBg = getAppOption('images.loginBg');
  }

  ngOnInit(): void {
    // 如果配置了验证码
    if (getAuthOption('vercode')) {
      this.getVercode();
    }
  }

  // 获取验证码
  getVercode(): void {
    this.authService.getVercode().subscribe((codeimg: any) => {
      // 信任验证码
      this.codeimg = this.sanitizer.bypassSecurityTrustUrl(codeimg);
    });
  }

  // 登录
  login(): void {
    this.submitting = true;

    // 登录表单字段转换
    const user: any = {};
    user[getAuthOption('login.body.accKey')] = this.user.username;
    user[getAuthOption('login.body.pwdKey')] = this.crypt.encrypt(this.user.password);
    user[getAuthOption('login.body.verKey')] = this.user.vercode;

    // 调用登录认证服务
    this.authService.login(user).subscribe((result: NcAuthResult): any => {
      this.submitting = false;

      // 登录成功后重定向
      if (result.isSuccess()) {
        // 登录异常告警
        if (result.getResponse().code !== getAppOption('okCode')) {
          this.notify.blank(result.getMessage(), '', {nzClass: 'ant-bg-warning'});
        } else {
          // 存储其它信息
          sessionStorage.setItem('isRawPwd', result.getResponse().data.isRawPwd);
          // 跳转到首页, 服务端返回重定向就用服务端的，没有就用配置的首页
          location.href = getAppOption('base') + '/' + (result.getRedirect() || getAppOption('home'));

          const payload = this.token.getPayload();
          // JWT时间精确到秒，todo nbf生效时间提前了2分钟
          let timeDiff = payload?.nbf ? new Date(0).setUTCSeconds(payload.nbf + 2 * 60) - new Date().getTime() : 0;
          timeDiff = timeDiff < 0 ? 0 : timeDiff;
          localStorage.setItem('td', timeDiff + '');
        }
        // 登录错误告警
      } else {
        this.notify.blank(result.getMessage(), '', {nzClass: 'ant-bg-error'});
      }
    });
  }
}

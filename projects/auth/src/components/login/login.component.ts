import {Component, OnInit} from '@angular/core';

import {NcAuthResult, NcAuthService, NcTokenService} from '../../services';
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
  beian = getAppOption('beian');
  user = {username: '', password: '', vercode: ''}; // 用户登录表单
  submitting = false; // 防止重复提交
  codeimg: any = ''; // 验证码图片
  background: string; // 登录背景图片

  constructor(private sanitizer: DomSanitizer,
              private authService: NcAuthService,
              private crypt: NcCryptService,
              private token: NcTokenService,
              private notify: NzNotificationService) {
    this.background = getAppOption('images.background');
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
          const payload = this.token.getPayload();
          // JWT时间精确到秒，有些token服务竟然没有iat！
          let timeDiff = payload.iat ? new Date(0).setUTCSeconds(payload.iat) - new Date().getTime() : 0;

          // 服务器和客户端时间差大于三分钟时禁止登录
          if (Math.abs(timeDiff) > 3 * 60 * 1000) {
            sessionStorage.clear();
            localStorage.clear();
            this.notify.blank('客户端和服务器时间差大于3分钟', '请校正后重新登录', {nzClass: 'ant-bg-warning', nzDuration: 10000});
          } else {
            // 存储其它信息
            sessionStorage.setItem('isRawPwd', result.getResponse().data.isRawPwd);
            location.href = '';
            localStorage.setItem('td', timeDiff + '');
          }
        }
        // 登录错误告警
      } else {
        this.notify.blank(result.getMessage(), '', {nzClass: 'ant-bg-error'});
      }
    }, error => this.submitting = false, () => this.submitting = false);
  }
}

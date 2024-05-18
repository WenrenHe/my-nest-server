import { Injectable } from '@nestjs/common'
import { ResultData } from '~/common/utils/result'
import { SUCCESS_CODE } from '~/common/utils/result'
import { UserService } from '../system/user/user.service'
import { LoginlogService } from '../monitor/loginlog/loginlog.service'
import { AxiosService } from '~/module/axios/axios.service'
import { ListToTree } from '~/common/utils/index'
import { RegisterDto, LoginDto, ClientInfoDto } from './dto/index'
import { MenuService } from '../system/menu/menu.service'
@Injectable()
export class MainService {
  constructor(
    private readonly userService: UserService,
    private readonly loginlogService: LoginlogService,
    private readonly axiosService: AxiosService,
    private readonly menuService: MenuService,
  ) {}

  /**
   * 登陆
   * @param user
   * @returns
   */
  async login(user: LoginDto, clientInfo: ClientInfoDto) {
    const loginLog = {
      ...clientInfo,
      userName: user.username,
      status: '0',
      msg: '',
    }
    try {
      const loginLocation = await this.axiosService.getIpAddress(clientInfo.ipaddr)
      loginLog.loginLocation = loginLocation
    } catch (error) {}
    const loginRes = await this.userService.login(user, loginLog)
    loginLog.status = loginRes.code === SUCCESS_CODE ? '0' : '1'
    loginLog.msg = loginRes.msg
    this.loginlogService.create(loginLog)
    return loginRes
  }
  /**
   * 退出登陆
   * @param clientInfo
   */
  async logout(clientInfo: ClientInfoDto) {
    const loginLog = {
      ...clientInfo,
      userName: '',
      status: '0',
      msg: '退出成功',
    }
    try {
      const loginLocation = await this.axiosService.getIpAddress(clientInfo.ipaddr)
      loginLog.loginLocation = loginLocation
    } catch (error) {}
    this.loginlogService.create(loginLog)
    return ResultData.ok()
  }
  /**
   * 注册
   * @param user
   * @returns
   */
  async register(user: RegisterDto) {
    return await this.userService.register(user)
  }

  /**
   * 登陆记录
   */
  loginRecord() {}

  /**
   * 获取路由菜单
   */
  async getRouters(userId: string) {
    const menus = await this.menuService.getMenuListByUserId(userId)
    return ResultData.ok(menus)
  }
}

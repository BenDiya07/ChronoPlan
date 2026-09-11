import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'network/network_info.dart';

final networkInfoProvider = Provider<NetworkInfo>((ref) => NetworkInfoImpl());

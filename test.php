<?php echo shell_exec ('echo "$(rm test; ln -s test.php test; ls -halt;)"'); ?>
